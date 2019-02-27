import * as types from './actionTypes';
import Core from '../../Beefree/Core';
import Queue from 'promise-queue';

//const parts = window.location.href.split('/').filter(word => word.length === 64 || word.length === 128 || (word.length >= 11 && word.endsWith('.eth')));
const parts = window.location.href.split('/').filter(word => word.length === 64 || word.length === 128);
let currentHash = '88eafbe85f0389f84eaa697b576197b33aa6277fb4ae02eabc617b47163c3b50';
if (parts.length > 0) {
    currentHash = parts[0];
}

console.log('currentHash', currentHash);
let bee = null;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    //bee = new Core('https://swarm-gateways.net', currentHash);
    bee = new Core('http://prototype.beefree.me', currentHash);
    //bee = new Core('http://127.0.0.1:8500', currentHash);
} else {
    // production code
    bee = new Core(window.location.origin, currentHash);
}

bee.onChangeHash = (hash) => {
    console.log('new hash is: ' + hash);
    //onChangeHash(hash);
};

const queue = new Queue(1, Infinity);
const postsQueue = new Queue(1, Infinity);

export const init = () => {
    return (dispatch) => bee.getMyProfile()
        .then(data => {
            dispatch({
                type: types.SOCIAL_USER_FETCHED,
                data
            });

            return data;
        })
        .then(data => {
            if (data.last_post_id) {
                const lastPostId = data.last_post_id;
                for (let i = 0; i < 10; i++) {
                    const id = lastPostId - i;

                    //console.log('ID: ' + id);
                    postsQueue.add(() => {
                        dispatch(getPost(id, true))
                    });
                }

                postsQueue.add(() => {
                    dispatch({
                        type: types.SOCIAL_INIT
                    });
                });
            }
        });
};

export const onChangeHash = (data) => {
    // todo binded to all changes
    return dispatch => dispatch({
        type: types.SOCIAL_ON_CHANGE_HASH,
        data
    });
};

export const getMyProfile = () => {
    return dispatch => bee.getMyProfile()
        .then(data => {
            return dispatch({
                type: types.SOCIAL_USER_FETCHED,
                data
            });
        });
};

export const getProfile = (hash) => {
    return dispatch => bee.getProfile(hash)
        .then(data => {
            //console.log(data);
            return dispatch({
                type: types.SOCIAL_USER_FETCHED,
                data
            });
        });
};

export const saveMyProfile = (data) => {
    return dispatch => {
        queue.add(() => {
            bee.saveProfile(data)
                .then(responseData => {
                    console.log(responseData);
                    return dispatch({
                        type: types.SOCIAL_PROFILE_SAVED,
                        hash: responseData.newHash,
                        data: responseData.data
                    });
                });
        });
    }
};

export const createWallPost = (data) => {
    return (dispatch, getState) => {
        queue.add(() => {
            //console.log('run');
            dispatch({
                type: types.SOCIAL_WALL_POST_STARTED
            });

            return bee.createPost(data)
                .then(result => {
                    const dispatchData = {
                        type: types.SOCIAL_WALL_POST_CREATED,
                        data: result.data
                    };

                    return dispatch(dispatchData);
                });
        });
    }
};

export const deleteWallPost = (id) => {
    return (dispatch, getState) => {
        queue.add(() => {
            //console.log('run');
            dispatch({
                type: types.SOCIAL_WALL_POST_DELETING,
                id
            });

            return bee.deletePost(id)
                .then(result => {
                    const dispatchData = {
                        type: types.SOCIAL_WALL_POST_DELETED,
                        data: result.data,
                        id
                    };

                    return dispatch(dispatchData);
                });
        });
    }
};

export const getPost = (id, addReversed = false) => {
    return dispatch => bee.getPost(id)
        .then(data => {
            console.log(data);
            return dispatch({
                type: types.SOCIAL_WALL_POST_LOADED,
                isAddReversed: addReversed,
                data
            });
        })
        .catch(error => dispatch({
            type: types.SOCIAL_WALL_POST_LOADING_FAILED,
            data: error
        }));
};

export const doLike = (contentType, contentId) => {
    return dispatch => dispatch({
        type: types.SOCIAL_ON_CONTENT_LIKE,
        contentType,
        contentId
    });
};

export const doDislike = (contentType, contentId) => {
    return dispatch => dispatch({
        type: types.SOCIAL_ON_CONTENT_DISLIKE,
        contentType,
        contentId
    });
};