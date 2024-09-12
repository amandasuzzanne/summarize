import React, { useContext, useState } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import axios from 'axios';   // Making API requests
import pdfToText from 'react-pdftotext'

const Main = () => {

    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context)
    const [isSaved, setIsSaved] = useState(false); // Track if the summary is saved
    const [selectedFile, setSelectedFile] = useState(null); // Track the selected file


    // Function to handle saving the summary
    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/summaries', {
                summary_text: resultData,
                original_text: recentPrompt // or any identifier for the original text
            });
            setIsSaved(true);
            console.log('Summary saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving summary:', error);
        }
    };


    // Function to handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            handleFileUpload(file); // Call file upload immediately after file is selected
        }
    };

    // Function to handle file upload and text extraction 
    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file)
            pdfToText(file)
                .then(text => {
                    setInput(text) // Set the extracted text to the input
                })
                .catch(error => {
                    console.error("Failed to extract text from pdf:", error)
                    setInput("Error: Failed to extract text from PDF")
                })
        } else {
            setSelectedFile(null)
            setInput('')
            alert('Please select a valid PDF file.')
        }
    }

    return (
        <div className='main'>
            <div className="main-container">

                {!showResult
                    ? <>
                        <div className="greet">
                            <div><span>Hello</span></div>
                            <p>How can I help you today?</p>
                        </div>
                    </>
                    : <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {!loading
                                ? <div>
                                    <p dangerouslySetInnerHTML={{ __html: resultData }} />
                                    {!isSaved && (
                                        <button onClick={handleSave} className="save-btn">
                                            Save
                                        </button>
                                    )}
                                    {isSaved && <p>Saved successfully!</p>}
                                </div>
                                : <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            }
                        </div>
                    </div>
                }

                <div className="main-bottom">
                    {selectedFile && (
                        <div className="selected-file">
                            <p>Uploaded PDF: {selectedFile.name}</p>
                        </div>
                    )}
                    <div className="search-box">
                        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
                        <div>
                            <input
                                type="file" id="fileUpload" style={{ display: 'none' }} accept="application/pdf" onChange={handleFileUpload}
                            />
                            <label htmlFor="fileUpload">
                                <img
                                    src={assets.gallery_icon} alt="Upload" onClick={() => document.getElementById('fileUpload').click()}
                                />
                            </label>
                            {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        The information might not always be accurate, so double-check its responses.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main