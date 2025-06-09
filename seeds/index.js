const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '67dd6a47bab12f28c4d2a8f5',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, doloribus',
            price: Math.floor(Math.random() * 20) + 10,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/df090drss/image/upload/v1747676491/YelpCamp/ctammqsgrgua0ao2agzm.jpg',
                    filename: 'YelpCamp/ctammqsgrgua0ao2agzm'
                }
            ]
        })
        await camp.save();
    }
}

seedDB()
    .then(() => {
        console.log('Seeding completed successfully');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Seeding error:', err);
        mongoose.connection.close();
    });