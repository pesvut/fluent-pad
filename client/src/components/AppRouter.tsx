import React from 'react' 
import './App.scss';
import App from '../components/App';
import {getQueryStringVal} from '../functions/query'

const AppRouter = () => {    
    const historyServiceId:string | null = getQueryStringVal("history")
    const userListServiceId:string | null = getQueryStringVal("userlist")    
    const canConnect:boolean = !!(historyServiceId && userListServiceId)

    return (
        <div className="main">
        {canConnect 
        ? <App /> 
        : <div>
             <div className="header-wrapper">
                <div className="header">
                    <div className="header-item">
                    </div>

                    <div className="header-item">
                        Connection status: disconnected
                    </div>
                </div>
            </div>
            <div>
                <div className="content">
                        <form
                            className="welcome-form"
                            onSubmit={(e) => {
                                window.open("/api/new-room");
                            }}
                        >
                            <h1 className="form-caption">Welcome to Maths 4 U</h1>
                            <p>Get started in building an epic knowledge in mathematics.</p>

                            <input
                                type="submit"
                                className="join-button"
                                value="Create Room"
                            />
                        </form>
                    
                </div>
            </div>
          </div >
        }
        </div>
    );
};

export default AppRouter;