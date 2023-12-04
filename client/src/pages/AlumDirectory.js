import React, { useState } from 'react';
import './AlumDirectoryStyles.css';
import Layout from '../components/Layout';
import { Link } from "react-router-dom";
import axios from 'axios'; 

function AlumDirectory() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [classYear, setClassYear] = useState('');
    const [practiceArea, setPracticeArea] = useState(''); 
    const [location, setLocation] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searched, setSearched] = useState(false);

    const Practices = ["Family Law", "Criminal Law ", "Corporate Law"];

    const handleSearch = async () => {
        setSearched(true);
        try {
            const response = await axios.get('http://localhost:8080/api/user');
            const allUsers = response.data;
    
            const filteredUsers = allUsers.filter(user => {
                const userClassYear = Number(user.class_year);
                const inputClassYear = Number(classYear);
    
                const inputFirstName = firstName.toLowerCase();
                const inputLastName = lastName.toLowerCase();
                const userFirstName = user.first_name.toLowerCase();
                const userLastName = user.last_name.toLowerCase();
    
                return (
                    (!firstName || userFirstName === inputFirstName) &&
                    (!lastName || userLastName === inputLastName) &&
                    (!classYear || userClassYear === inputClassYear) &&
                    (!practiceArea || user.practice_area === practiceArea)
                );
            });
    
            setSearchResults(filteredUsers);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };
    
    
    const handleClear = () => {
        setSearched(false);
        setFirstName('');
        setLastName('');
        setClassYear('');
        setPracticeArea('');
        setLocation('');
        setSearchResults([]);
    };

    return (
        <>
            <Layout>
                <h2 className='title2'>Search For your Fellow Alumni</h2>
                <div className='container'>
                    <div className='search-area'>
                        <input type="text" placeholder="Search by First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <input type="text" placeholder="Search by Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <input type="number" placeholder="Class Year" min = "1950" max = "2023" value={classYear} onChange={(e) => setClassYear(e.target.value)} />
                        
                        <select value={practiceArea} onChange={(e) => setPracticeArea(e.target.value)}>
                            <option value="">Select a Practice Area</option>
                            {Practices.map(practice => (
                                <option key={practice} value={practice}>{practice}</option>
                            ))}
                        </select>

                        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <div className='buttons-container'>
                        <button onClick={handleSearch} className="search">Search</button>
                        <button onClick={handleClear} className="clear">Clear</button>
                    </div>

                    <div className='card-item'>
                    {searched && searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <Link to={`/profile/${result.id}`} className='result-link' key={result.id}>
                                <div className="result-card">
                                    <p>Name: {result.first_name} {result.last_name}</p> 
                                    <p>Class Year: {result.class_year}</p> 
                                    <p>Practice Area: {result.practice_area}</p>
                                </div>
                            </Link>
                        ))
                        ) : searched ? (
                        <div className="no-results-message">
                            No results found. Please adjust your search criteria.
                        </div>
                        ) : null}
                    </div>
                
                </div>
            </Layout>
        </>
    );
}

export default AlumDirectory;
