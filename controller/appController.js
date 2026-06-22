const { body, validationResult, matchedData } = require('express-validator');
const db = require('../db/queries');

const alphaErr = 'Must only contain  letters.';
const lengthErr = 'Must be between 1 and 10 characters.';
const pwdErr = 'Password must be at least 3 characters long.';

const validateUser = [
    body('firstName').trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
    body('lastName').trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
    body('username').trim()
        .isAlpha().withMessage(`Username ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`Username ${lengthErr}`),
    body('password')
        .isLength({ min: 3 }).withMessage(`${pwdErr}`),
    body('confirmPwd').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match');
        }
        return true
    }),
]

async function homePage(req, res) {
    try {
        const messages = await db.getAllMessages();

        // if user logged in, count his messages
        let messageCount = 0;
        if (req.user) {
            messageCount = await db.countMessages(req.user.id);
        }

        res.render('index', {
            title: 'Home',
            messages: messages,
            messageCount: messageCount // sending info to the HTML
        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading homepage...');
    }
};

async function register(req, res) {
    res.render('register', {
        title: 'Register Page'
    });
};

async function login(req, res) {
    res.render('login', {
        title: 'Login Page'
    });
};

async function message(req, res) {
    res.render('message', {
        title: "Message Post"
    });
};

async function member(req, res) {
    res.render('membership', {
        title: 'Membership'
    });
};

async function beAdmin(req, res) {
    res.render('beAdmin', {
        title: 'Be Admin'
    });
};

async function newUser(req, res) {
    const { firstname, lastname, username, password } = req.body;

    if (!firstname || !lastname || !username || !password) {
        return res.status(400).send('Please fill all the fields...');
    }

    try {
        await db.saveUser(firstname, lastname, username, password);
        // Set the flash message
        req.flash('success', 'Account created successfully!');
        res.redirect('/login');
    } catch (error) {
        console.error('Database error: ', error);
        res.status(500).send('Something went wrong');
    }
}

async function postMessage(req, res) {
    const alias_id = req.user.id;
    const info = req.body.info;

    if (!info || info.trim() === '') {
        return res.status(400).send('Please type a message...');
    }

    try {
        await db.saveMessage(alias_id, info);
        res.redirect('/');
    } catch (error) {
        console.error('Database error: ', error);
        res.status(500).send('Something went wrong');
    }
};

async function processMembership(req, res) {
    // Grab ID from the user logged in
    const userId = req.user.id;

    try {
        await db.beMember(userId);

        // Update 'req.user' so the app know the user is a member now
        req.user.member = true;
        res.redirect('/');
    } catch (error) {
        console.error('Error updating member status: ', error);
        res.status(500).send('Could not process your request');
    }
}

async function processAdmin(req, res) {
    const userId = req.user.id;

    try {
        await db.makeUserAdmin(userId);
        req.user.admin = true;
        res.redirect('/');
    } catch (error) {
        console.error('Error updating Admin status: ', error);
        res.status(500).send('Could not process your request...');
    }
}

async function loggingOut(req, res, next) {
    req.logout((error) => {
        if (error) {
            return next(error);
        }

        res.redirect('/');
    });
};

async function deletePost(req, res) {
    await db.deleteMsg(req.params.id);
    res.redirect('/');
}

module.exports = {
    homePage, 
    register, 
    login,
    message,
    member,
    beAdmin,  
    newUser,
    postMessage,
    processMembership,
    processAdmin, 
    loggingOut,
    deletePost
};