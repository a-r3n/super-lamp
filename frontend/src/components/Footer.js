// src/components/Footer.js
import React, { useState } from 'react';
import axios from 'axios';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/submit-email`, { email });
            console.log('Email submitted:', response.data.message);
            setEmail('');  // Clear input after submission
        } catch (error) {
            console.error('Error submitting email:', error);
        }
    };

    return (
        <div className="footer">
            <p>Want to keep up with the week's business news?</p>
            <p>Sign up to our weekly email</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Footer;
