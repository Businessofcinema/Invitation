import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux'
import './UserPage.css';
import UserFollowings from "../../UserFollowings";
import UserWallet from "../../UserWallet";
import Wall from "../../Wall";

class UserPage extends Component {
    render() {
        return (
            <Fragment>
                {/*<div className="row">
                    <div className="col-sm-12 App-block-border">
                        <UserInfo/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-5">
                        <div className="App-block-border">
                            <UserStorage/>
                        </div>
                        <div className="App-block-border">
                            <UserFollowings/>
                        </div>
                        <div className="App-block-border">
                            <UserWallet/>
                        </div>
                    </div>
                    <div className="col-sm-1"/>
                    <div className="col-sm-5">
                        <Wall/>
                    </div>
                </div>*/}
                <div className="row">
                    <div className="col-lg-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="main-l-bar-wrap">

                                        <UserFollowings/>

                                        <UserWallet/>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <Wall/>
                    </div>
                </div>
            </Fragment>
        );
    }
}

/*UserPage.propTypes = {
    user: PropTypes.shape({
        first_name: PropTypes.string
    }),
    getUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    //count: state.getIn(['count']),
    //user: state.getIn(['social', 'user'])
    user: state.social.user
});

const mapDispatchToProps = dispatch => ({
    getUser: () => dispatch(getUser()),
});*/

const mapStateToProps = state => ({
    user: state.social.user
});

//export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
export default connect(mapStateToProps)(UserPage)
//export default connect()(UserPage)
