import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, resetUserSession } from './service/AuthService'

const MyProfile = () => {
    const navigate = useNavigate();
    const user = getUser();
    console.log(user)
    const name = user !== 'undefined' && user ? user.name : '';
    const username = user !== 'undefined' && user ? user.username : '';
    const email = user !== 'undefined' && user ? user.email : '';
    const age = user !== 'undefined' && user ? user.age : '';
    const sex = user !== 'undefined' && user ? user.sex : '';
    const orientation = user !== 'undefined' && user ? user.orientation : '';
    const diet = user !== 'undefined' && user ? user.diet : '';
    const drinks = user !== 'undefined' && user ? user.drinks : '';
    const drugs = user !== 'undefined' && user ? user.drugs : '';
    const education = user !== 'undefined' && user ? user.education : '';
    const ethnicity = user !== 'undefined' && user ? user.ethnicity : '';
    const income = user !== 'undefined' && user ? user.income : '';
    const location = user !== 'undefined' && user ? user.location : '';
    const pets = user !== 'undefined' && user ? user.pets : '';
    const smokes = user !== 'undefined' && user ? user.smokes : '';
    const speaks = user !== 'undefined' && user ? user.speaks : '';

    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [user])

    if (user) {
        return (
            <div>
                Name: {name} <br />
                Username: {username} <br />
                Email: {email} <br />
                Age: {age} <br />
                Sex: {sex} <br />
                Orientation: {orientation} <br />
                Diet: {diet} <br />
                Drinks: {drinks} <br />
                Drugs: {drugs} <br />
                Education: {education} <br />
                Ethnicity: {ethnicity} <br />
                Income: {income} <br />
                Location: {location} <br />
                Pets: {pets} <br />
                Smokes: {smokes} <br />
                Speaks: {speaks} <br />
            </div >
        )
    }
}

export default MyProfile