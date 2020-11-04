import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { db } from '../../firebase';
import { useDataLayerValue } from '../../DataLayer';

// React icons
import AttachmentIcon from '../../React icons/AttachmentIcon';
import MoreOptionsIcon from '../../React icons/MoreOptionsIcon';
import SearchIcon from '../../React icons/SearchIcon';
import SmileIcon from '../../React icons/SmileIcon';
import MicIcon from '../../React icons/MicIcon';

// Styled components
import StyledMainChat from './StyledMainChat';

// React components
import Avatar from '../Avatar/Avatar';
import Messages from './Messages/Messages';

const MainChat = ({ match }) => {
    console.log('Match', match);
    const [{ user }, dispatch] = useDataLayerValue();
    const chatId = match.params.chatId;
    const [messages, setMessages] = useState([]);
    const [chatName, setChatName] = useState('');
    const [input, setInput] = useState('');

    useEffect(() => {
        if (chatId) {
            db.collection('chats')
                .doc(chatId)
                .onSnapshot((snapshot) => {
                    setChatName(snapshot?.data()?.name);
                });

            db.collection('chats')
                .doc(chatId)
                .collection('messages')
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) => doc.data())));
        }
    }, [chatId]);

    const sendMessage = (event) => {
        event.preventDefault();
        if (input === '') return;

        db.collection('chats').doc(chatId).collection('messages').add({
            message: input,
            name: user.displayName,
            userId: user.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        setInput('');
    };

    return (
        <StyledMainChat>
            <div className='mainChat__header'>
                <Avatar width='45px' height='45px' />
                <div className='mainChat__header__info'>
                    <h2>{chatName}</h2>
                    <p className='mainChat__header__info__lastSeen'>Last seen at ...</p>
                </div>
                <div className='mainChat__header__icons'>
                    {/* <AttachmentIcon /> */}
                    <SearchIcon />
                    <MoreOptionsIcon />
                </div>
            </div>

            <div className='mainChat__body'>
                {messages.map((message) => (
                    <Messages message={message} />
                ))}
                <div id='messagesEnd' style={{ visibility: 'hidden' }}></div>
            </div>

            <div className='mainChat__chatbarContainer'>
                <SmileIcon />
                <form className='mainChat__chatbarContainer__chatForm'>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type='text'
                        name='chatbarInput'
                        id='chatbarInput'
                        placeholder='Type a message'
                    />
                    <button onClick={sendMessage} type='submit'>
                        Send a message
                    </button>
                </form>
                <MicIcon />
            </div>
        </StyledMainChat>
    );
};

export default MainChat;
