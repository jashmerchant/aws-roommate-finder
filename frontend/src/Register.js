import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from './service/AuthService'
import axios from 'axios';

// const registerUrl = "https://lqjgcqa4lf.execute-api.us-east-1.amazonaws.com/prod/register"
const registerUrl = "https://ao9v2ya7ci.execute-api.us-east-1.amazonaws.com/deploy/register"

const Register = () => {
    const navigate = useNavigate();
    const user = getUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    //If user authenticated, redirect them
    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [user])

    const submitHandler = (event) => {

        const isEmpty = (element) => {
            return (!element.value.trim() || element.value.trim() === "")
        }

        event.preventDefault();
        if (username.trim() === '' || email.trim() === '' || name.trim() === '' || password.trim() === '') {
            setMessage('All fields required');
            return;
        }
        for (let ele of event.target.elements) {
            if (isEmpty(ele)) {
                setMessage('All fields required')
                return;
            }
        }


        setMessage(null);
        const requestBody = {
            username: username,
            email: email,
            name: name,
            password: password,
        }
        for (let ele of event.target.elements) {
            if (ele.name !== "") {
                requestBody[ele.name] = ele.value
            }
        }
        axios.post(registerUrl, requestBody).then(response => {
            setMessage('Registeration succesful');
        }).catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Backend server error');
            }
        })
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
            <h3 class="mb-30">Register</h3>

            <div class="container">
                <div class="row justify-content-between">
                    <div class="col-5" >
                    <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input placeholder="Enter your name" id="name" type="text" class="form-control" required value={name} onChange={event => setName(event.target.value)} /> <br />
                    <label for="email" class="form-label">Email</label>
                    <input placeholder="Enter your email" id="email" type="email" class="form-control" required value={email} onChange={event => setEmail(event.target.value)} /> <br />
                    <label for="username" class="form-label">Username</label>
                    <input placeholder="Enter your username" id="username" type="text" class="form-control" required value={username} onChange={event => setUsername(event.target.value)} /> <br />
                    <label for="password" class="form-label">Password</label>
                    <input placeholder="Enter your password" id="password" type="password" class="form-control" required value={password} onChange={event => setPassword(event.target.value)} /> <br />
                
                    <label for="age" class="form-label">Age</label>
                    <input placeholder="Enter your age" name='age' id="age" type="number" class="form-control" required /> <br />
                    
                    {/* <fieldset> */}
                    <label for="sex" class="form-label">Sex</label>
                        <div class="form-check">
                        <input type="radio" name="sex" class="form-check-input" id="sexmale"/>
                        <label class="form-check-label" for="sexmale">Male</label>
                        </div>
                        <div class="mb-3 form-check">
                        <input type="radio" name="sex" class="form-check-input" id="sexfemale"/>
                        <label class="form-check-label" for="sexfemale">Female</label>
                        </div>
                    {/* </fieldset> */}

                    <label for="orientation" class="form-label">Orientation</label>
                    <select name="orientation" class="mb-3 custom-select form-select" id="orientation">
                        <option selected>Select your sexual orientation</option>
                        <option value="straight">straight</option>
                        <option value="bisexual">bisexual</option>
                        <option value="gay">gay</option>
                    </select>
        
                    <label for="diet" class="form-label" > Diet</label>
                    <select name="diet" class="mb-3 custom-select form-select" id="diet">
                        <option selected>Select your diet type</option>
                        <option value="vegetarian">vegetarian</option>
                        <option value="vegan">vegan</option>
                        <option value="halal">halal</option>
                        <option value="kosher">kosher</option>
                        <option value="anything">anything</option>
                        <option value="other">other</option>
                    </select>

                    <label for="education" class="form-label">Education</label>
                    <input placeholder="Enter your education details" name='education' id="education" type="text" class="form-control" required /> <br />
                    
                    <label for="income" class="form-label">Income</label>
                    <input placeholder="Enter your approx income" name='income' id="income" type="text" class="form-control" required /> <br />
                
                    </div>
                    </div>
                    <div class="col-5" >
                    <div class="mb-3">
                    <label for="ethnicity" class="form-label" >Ethnicity</label>
                    <select name="ethnicity" multiple class="mb-3 custom-select form-select" id="ethnicity">
                        <option selected>Which ethnicity do you belong to?</option>
                        <option value="asian">Asian</option>
                        <option value="white">White</option>
                        <option value="black">Black</option>
                        <option value="hispanic/latin">Hispanic/Latino</option>
                        <option value="indian">Indian</option>
                        <option value="pacificislander">Pacific Islander</option>
                        <option value="middleeastern">Middle Eastern</option>
                        <option value="nativeamerican">Native American</option>
                    </select>

                    <label for="pets" class="form-label"> pets</label>
                    <select name="pets" multiple class="mb-3 custom-select form-select" id="pets">
                        <option selected>Do you own any pets?</option>
                        <option value="cats">cats</option>
                        <option value="dogs">dogs</option>
                    </select>

                    <label for="location" class="form-label" >Location</label>
                    <select name="location" class="mb-3 custom-select form-select" id="location">
                        <option selected>Select Location?</option>
                        <option value="california">california</option>
                        <option value="colorado">colorado</option>
                        <option value="new york">new york</option>
                        <option value="oregon">oregon</option>
                        <option value="arizona">arizona</option>
                        <option value="hawaii">hawaii</option>
                        <option value="montana">montana</option>
                        <option value="spain">spain</option>
                        <option value="nevada">nevada</option>
                        <option value="illinois">illinois</option>
                        <option value="vietnam">vietnam</option>
                        <option value="ireland">ireland</option>
                        <option value="louisiana">louisiana</option>
                        <option value="michigan">michigan</option>
                        <option value="united kingdom">united kingdom</option>
                        <option value="massachusetts">massachusetts</option>
                        <option value="north carolina">north carolina</option>
                        <option value="idaho">idaho</option>
                        <option value="mississippi">mississippi</option>
                        <option value="new jersey">new jersey</option>
                        <option value="florida">florida</option>
                        <option value="minnesota">minnesota</option>
                        <option value="georgia">georgia</option>
                        <option value="utah">utah</option>
                        <option value="washington">washington</option>
                        <option value="west virginia">west virginia</option>
                        <option value="connecticut">connecticut</option>
                        <option value="tennessee">tennessee</option>
                        <option value="rhode island">rhode island</option>
                        <option value="district of columbia">district of columbia</option>
                        <option value="canada">canada</option>
                        <option value="missouri">missouri</option>
                        <option value="germany">germany</option>
                        <option value="pennsylvania">pennsylvania</option>
                        <option value="netherlands">netherlands</option>
                        <option value="switzerland">switzerland</option>
                        <option value="ohio">ohio</option>
                    </select>

                    <label for="speaks" class="form-label" >Which languages do you speak</label>
                    <select name="speaks" multiple class="mb-3 custom-select form-select" id="speaks">
                        <option selected>Select the languages you speak?</option>
                        <option value="lisp">lisp</option>
                        <option value="hindi">hindi</option>
                        <option value="ilongo">ilongo</option>
                        <option value="tamil">tamil</option>
                        <option value="welsh">welsh</option>
                        <option value="latin">latin</option>
                        <option value="icelandic">icelandic</option>
                        <option value="indonesian">indonesian</option>
                        <option value="belarusan">belarusan</option>
                        <option value="chechen">chechen</option>
                        <option value="arabic">arabic</option>
                        <option value="signlanguage">sign language</option>
                        <option value="mongolian">mongolian</option>
                        <option value="russian">russian</option>
                        <option value="catalan">catalan</option>
                        <option value="dutch">dutch</option>
                        <option value="serbian">serbian</option>
                        <option value="italian">italian</option>
                        <option value="ancientgreek">ancient greek</option>
                        <option value="norwegian">norwegian</option>
                        <option value="bengal">bengal</option>
                        <option value="portuguese">portuguese</option>
                        <option value="croatian">croatian</option>
                        <option value="hawaiian">hawaiian</option>
                        <option value="swahili">swahili</option>
                        <option value="korean">korean</option>
                        <option value="afrikaans">afrikaans</option>
                        <option value="slovak">slovak</option>
                        <option value="greek">greek</option>
                        <option value="persian">persian</option>
                        <option value="thai">thai</option>
                        <option value="occitan">occitan</option>
                        <option value="hebrew">hebrew</option>
                        <option value="armenian">armenian</option>
                        <option value="tibetan">tibetan</option>
                        <option value="czech">czech</option>
                        <option value="c++">c++</option>
                        <option value="finnish">finnish</option>
                        <option value="romanian">romanian</option>
                        <option value="urdu">urdu</option>
                        <option value="gujarati">gujarati</option>
                        <option value="swedish">swedish</option>
                        <option value="malay">malay</option>
                        <option value="maori">maori</option>
                        <option value="basque">basque</option>
                        <option value="hungarian">hungarian</option>
                        <option value="polish">polish</option>
                        <option value="bulgarian">bulgarian</option>
                        <option value="english">english</option>
                        <option value="breton">breton</option>
                        <option value="cebuano">cebuano</option>
                        <option value="tagalog">tagalog</option>
                        <option value="vietnamese">vietnamese</option>
                        <option value="slovenian">slovenian</option>
                        <option value="lithuania">lithuania</option>
                        <option value="french">french</option>
                        <option value="danish">danish</option>
                        <option value="farsi">farsi</option>
                        <option value="sardinian">sardinian</option>
                        <option value="esperanto">esperanto</option>
                        <option value="turkish">turkish</option>
                        <option value="rotuman">rotuman</option>
                        <option value="estonian">estonian</option>
                        <option value="khmer">khmer</option>
                        <option value="german">german</option>
                        <option value="ukrainian">ukrainian</option>
                        <option value="georgian">georgian</option>
                        <option value="yiddish">yiddish</option>
                        <option value="japanese">japanese</option>
                        <option value="latvian">latvian</option>
                        <option value="sanskrit">sanskrit</option>
                        <option value="irish">irish</option>
                        <option value="spanish">spanish</option>
                        <option value="frisian">frisian</option>
                        <option value="chinese">chinese</option>
                        <option value="albanian">albanian</option>
                    </select>

                    <label for="smokes" class="form-label">Smoke</label>
                    <select name="smokes" class="mb-3 custom-select form-select" id="smokes">
                        <option selected>Do you smoke?</option>
                        <option value="yes">yes</option>
                        <option value="when drinking">when drinking</option>                    
                        <option value="sometimes">sometimes</option>
                        <option value="trying to quit">trying to quit</option>
                        <option value="no">no</option>
                    </select>
                    
                    <label for="drinks" class="form-label" > Drinks</label>
                    <select name="drinks" class="mb-3 custom-select form-select" id="drinks">
                        <option selected>Do you drink?</option>
                        <option value="socially">socially</option>
                        <option value="often">often</option>
                        <option value="not at all">not at all</option>
                        <option value="rarely">rarely</option>
                        <option value="very often">very often</option>
                        <option value="desperately">desperately</option>
                    </select>

                    <label for="drugs" class="form-label"> Drugs</label>
                    <select name="drugs" class="mb-3 custom-select form-select" id="drugs">
                        <option selected>Do you indulge in other dugs?</option>
                        <option value="never">never</option>
                        <option value="often">often</option>
                        <option value="sometimes">sometimes</option>
                    </select>
                    </div>
                    </div>
                </div>
                <div class="justify-content-center my-flex">
                    <div class="v-flex">
                    <input class=" w-fit btn btn-primary" type="submit" value="Register" /><br/>
                    {message && <p className='message'>{message}</p>}
                    </div>
                </div>
            </div>
            </form>
        </div>
    )
}

export default Register;