import React from 'react';

const testimonials = [
  {
    id: 1,
    image: require('./images/file (2).jpg'),
    name: 'Farmer Johmmy chao',
    review: 'Great experience with our product!',
  },
  {
    id: 2,
    image: require('./images/file.jpg'),
    name: ' Customer Jane Ali',
    review: 'It has made buying so much easier!',
  },
  {
    id: 3,
    image: require('./images/file2.jpg'),
    name: 'Customer  Ali Humza',
    review: 'Highly recommend to all Customers.',
  },
];

const Homepage5 = () => {
  return (
 <div className='testimonial-container' >
    <h1 className='testimonial'  >Testimonials</h1>
       <div className="testimonial-row">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="testimonial-card">
          <img src={testimonial.image} alt={testimonial.name} className="testimonial-card__image" />
          <h3 className="testimonial-card__name">{testimonial.name}</h3>
          <p className="testimonial-card__review">{`"${testimonial.review}"`}</p>
        </div>
      ))}
    </div>
 </div>
  );
};

export default Homepage5;
