import React, {Component, Fragment} from 'react';
import './UserFollowings.css';
import {connect} from "react-redux";
import * as actions from "../../store/social/actions";
import User from "../../Beefree/User";
import defaultAvatar from './../../img/user/default.jpg'

class UserFollowings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    onChange = (e) => {
        this.setState({
            [e.target.dataset.field]: e.target.value
        });
    };

    onUsernameClick = (e) => {
        e.preventDefault();
    };

    onAddToFriends = (userId) => {
        console.log('onAddToFriends', userId);
        // todo add user here
    };

    onFindByUsername = () => {
        const {findUser} = this.props;
        findUser(this.state.username);
    };

    render() {
        const {isFindUser, findUserError, foundUsers, avatars, getAvatarByHash} = this.props;
        const iFollow = User.getIFollow(this.props.user);
        let users = iFollow.map((item, index) => (
            (
                <div key={index} className="item">
                    <div className="container">
                        <div className="row">
                            <div className="col-9">
                                <div className="l-bar">
                                    <div className="avatar-wrap">
                                        <img src={User.getAvatar(item)} alt=""/>
                                    </div>
                                    <div className="nickname-wrap">
                                        <p>
                                            <span className="following-username" onClick={this.onUsernameClick}>
                                                @{item.username}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="followers">
                                    <div className="ammount-wrap">
                                        <span>{User.getNotifications(item)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        ));

        if (iFollow.length === 0) {
            users = (<div className="container">
                <small className="text-muted">Add friends or be alone</small>
            </div>);
        }

        let foundUsersText = foundUsers.length > 0 ?
            <Fragment>
                <hr/>
                {foundUsers.map((item, index) => {
                    if (item && item.SwarmHash && item.Username) {
                        const username = User.getUsername(item.Username);
                        let foundAvatar = avatars.find(item => item.swarmHash.toLowerCase() === item.swarmHash.toLowerCase());
                        const avatar = foundAvatar ? foundAvatar.avatar : defaultAvatar;

                        return (<div key={index}>
                            <img src={avatar} alt="Avatar" className="UserFollowings-avatar"/> <span>{username}</span>
                            <div className="float-right">
                                <button className="btn btn-success"
                                        onClick={() => this.onAddToFriends(item.userId)}
                                >
                                    <i className="fas fa-plus"/> Add
                                </button>
                            </div>
                        </div>);
                    } else {
                        return (<p key={index}>User not found</p>);
                    }
                })}
            </Fragment>
            : (<span/>);

        return (
            <Fragment>
                <div className="modal fade" id="friendsModal" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Friends</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {findUserError && <div className="alert alert-danger" role="alert">
                                    {findUserError}
                                </div>}

                                <div className="form-group">
                                    <label>Find by Username</label>
                                    <input type="text"
                                           className="form-control"
                                           placeholder="Username"
                                           onChange={this.onChange}
                                           data-field="username"
                                           value={this.state.username}/>
                                </div>

                                <div>
                                    {isFindUser && <button className="btn btn-primary" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status"
                                              aria-hidden="true"/>
                                        &nbsp;Find...
                                    </button>}

                                    {!isFindUser && <button className="btn btn-primary"
                                                            disabled={this.state.username.length === 0}
                                                            onClick={this.onFindByUsername}>
                                        Find
                                    </button>}
                                </div>

                                {foundUsersText}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="follows-block _block">
                    <div className="header-wrap">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-7">
                                    <div className="block-name">
                                        <p>
                                            <i className="fas fa-user-check"/>
                                            Friends
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="btn-wrap">
                                        <button className="btn btn-beefree"
                                                data-toggle="modal"
                                                data-target="#friendsModal">
                                            <i className="fas fa-plus"/> Add friend
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-wrap">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="items-wrap">

                                    {users}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.social.user,
    foundUsers: state.social.foundUsers,
    findUserError: state.social.findUserError,
    isFindUser: state.social.isFindUser,
    avatars: state.social.avatars,
});

export default connect(mapStateToProps, actions)(UserFollowings);