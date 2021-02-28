import _, { update } from 'lodash';
import { useEffect, useState } from 'react';
import { PeerIdB58, subscribeToEvent } from '@fluencelabs/fluence';

import { addStyles, EditableMathField } from 'react-mathquill'

import { fluentPadServiceId, notifyTextUpdateFnName } from 'src/app/constants';
import { useFluenceClient } from '../app/FluenceClientContext';
import { getUpdatedDocFromText, initDoc, SyncClient } from '../app/sync';
import * as api from 'src/app/api';

// adds styles for react-mathquill
addStyles()

export interface DataItem {
    enabled: boolean;
    text: string;
    type: string;
}

const DEFAULT_DATA_ITEM:DataItem = {
    enabled: true,
    text: "",
    type: "doc"
}

const broadcastUpdates = _.debounce((text: string, syncClient: SyncClient) => {
    let doc = syncClient.getDoc();
    if (doc) {
        let newDoc = getUpdatedDocFromText(doc, text);
        syncClient.syncDoc(newDoc);
    }
}, 100);

export const CollaborativeEditor = () => {
    const client = useFluenceClient()!;
    const [list, setList] = useState<DataItem[] | null>(null);
    const [text, setText] = useState<string | null>(null);
    const [syncClient, setSyncClient] = useState(new SyncClient());

    function updateListIndex(newItem: string | null, index: number) {
        let newList;
        if (list === null)
            newList = null
        else 
            newList = [...list];
        
        newList[index].text = newItem;

        return updateList(newList)
    }

    function appendToList(newItemType:string) {
        let newList;
        if (list === null)
            return null
        else 
            newList = [...list];
        
        newList.push({...DEFAULT_DATA_ITEM, type: newItemType})

        return updateList(newList)
    }

    function updateList(newList: DataItem[]) {
        setList( newList );
        const newText = JSON.stringify(newList);
        setText( newText );
        return newText;
    }

    function parseToList(newText: string):void {
        if (!newText)
            newText = JSON.stringify([DEFAULT_DATA_ITEM]);

        setText( newText );
        console.log( newText )
        const newList = JSON.parse(newText) 
        setList( newList );
    }

    useEffect(() => {
        syncClient.handleDocUpdate = (doc) => {
            parseToList(doc.text.toString());
        };

        syncClient.handleSendChanges = (changes: string) => {
            api.addEntry(client, changes);
        };

        const unsub = subscribeToEvent(client, fluentPadServiceId, notifyTextUpdateFnName, (args, tetraplets) => {
            const [authorPeerId, changes, isAuthorized] = args as [PeerIdB58, string, boolean];
            if (authorPeerId === client.selfPeerId) {
                return;
            }

            if (changes) {
                syncClient.receiveChanges(changes);
            }
        });

        syncClient.start();

        // don't block
        api.getHistory(client).then((res) => {
            for (let e of res) {
                syncClient.receiveChanges(e.body);
            }

            if (syncClient.getDoc() === undefined) {
                syncClient.syncDoc(initDoc());
            }
        });

        return () => {
            unsub();
            syncClient.stop();
        };
    }, []);

    const handleTextUpdate = (itemText: string, index: number) => {
        const newText = updateListIndex(itemText, index);
        broadcastUpdates(newText, syncClient);
    };

    return (
        <div>
            {list ? list.map((item, index) => {
                switch(item.type) {
                    case "latex": 
                        return <EditableMathField
                            latex={item.text}
                            onChange={(mathField) => handleTextUpdate(mathField.latex(), index)}
                        />

                    case "doc":
                    default:
                        return <textarea
                            spellCheck={false}
                            className="code-editor"
                            disabled={item.text === null}
                            value={item.text ?? ''}
                            onChange={(e) => handleTextUpdate(e.target.value, index)}
                        />
                }
            }) : <p> Loading data... </p>}
        
        <div className="add-code-section-buttons">
            <button className="add-code-section" onClick={()=>appendToList("doc")}> &#x1F4DD; </button>
            <button className="add-code-section" onClick={()=>appendToList("latex")} style={{"fontSize": "0.8em"}}> 1+1 </button>
            
        </div>
        
        </div>
        
    );
};
