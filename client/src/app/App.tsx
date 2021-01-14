import { createClient, FluenceClient, subscribeToEvent } from '@fluencelabs/fluence';
import { dev } from '@fluencelabs/fluence-network-environment';
import React, { useEffect, useState } from 'react';

import './App.scss';
import { FluenceClientContext } from './FluenceClientContext';
import { UserList } from './UserList';
import * as calls from 'src/fluence/calls';
import { CollaborativeEditor } from './CollaborativeEditor';

const App = () => {
    const [client, setClient] = useState<FluenceClient | null>(null);
    const [isInRoom, setIsInRoom] = useState<boolean>(false);
    const [nickName, setNickName] = useState('myNickName');

    useEffect(() => {
        const fn = async () => {
            const c = await createClient(dev[0]);
            setClient(c);
        };
        fn();
    }, []);

    const joinRoom = async () => {
        if (!client) {
            return;
        }

        await calls.join(client, nickName);
        setIsInRoom(true);
    };

    const leaveRoom = async () => {
        if (!client) {
            return;
        }

        await calls.leave(client);
        setIsInRoom(false);
    };

    return (
        <FluenceClientContext.Provider value={client}>
            <div className="App">
                <div>
                    <div>Connection status: {client ? 'connected' : 'disconnected'}</div>
                    <div>
                        <label>Nickname: </label>
                        <input
                            type="text"
                            value={nickName}
                            disabled={isInRoom}
                            onChange={(e) => {
                                const name = e.target.value;
                                setNickName(name);
                            }}
                        />
                    </div>
                    <div>
                        <button disabled={isInRoom || !client} onClick={joinRoom}>
                            Join Room
                        </button>
                    </div>
                    <div>
                        <button disabled={!isInRoom} onClick={leaveRoom}>
                            Leave Room
                        </button>
                    </div>
                </div>

                <div className="wrapper">
                    <div>{isInRoom && client && <CollaborativeEditor />}</div>
                    {/* <div>{isInRoom && client && <UserList selfName={nickName} />}</div> */}
                </div>
            </div>
        </FluenceClientContext.Provider>
    );
};

export default App;
