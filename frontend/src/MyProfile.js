import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from './service/AuthService'

const MyProfile = () => {
    const navigate = useNavigate();
    const user = getUser();
    // console.log(user)
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
            <dl class="row">
                <dt class="col-sm-3">Name</dt>
                <dd class="col-sm-9">{name}</dd>

                <dt class="col-sm-3">Email</dt>
                <dd class="col-sm-9">{email}</dd>

                <dt class="col-sm-3">Username</dt>
                <dd class="col-sm-9">{username}</dd>

                <dt class="col-sm-3">Age</dt>
                <dd class="col-sm-9">{age}</dd>

                <dt class="col-sm-3">Sex</dt>
                <dd class="col-sm-9">{sex}</dd>

                <dt class="col-sm-3">Orientation</dt>
                <dd class="col-sm-9">{orientation}</dd>

                <dt class="col-sm-3">Diet</dt>
                <dd class="col-sm-9">{diet}</dd>
                
                <dt class="col-sm-3">Education</dt>
                <dd class="col-sm-9">{education}</dd>
                
                <dt class="col-sm-3">Income</dt>
                <dd class="col-sm-9">{income}</dd>
                
                <dt class="col-sm-3">Ethnicity</dt>
                <dd class="col-sm-9">{ethnicity}</dd>
                
                <dt class="col-sm-3">Pets</dt>
                <dd class="col-sm-9">{pets}</dd>
                
                <dt class="col-sm-3">Location</dt>
                <dd class="col-sm-9">{location}</dd>
                
                <dt class="col-sm-3">Language</dt>
                <dd class="col-sm-9">{speaks}</dd>
                
                <dt class="col-sm-3">Smokes</dt>
                <dd class="col-sm-9">{smokes}</dd>
                
                <dt class="col-sm-3">Drinks</dt>
                <dd class="col-sm-9">{drinks}</dd>
                
                <dt class="col-sm-3">Drugs</dt>
                <dd class="col-sm-9">{drugs}</dd>
            </dl>
            
        </div >
        )
    }
}

export default MyProfile