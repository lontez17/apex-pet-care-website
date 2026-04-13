export interface Review {
  name: string;
  date: string;
  service: string;
  text: string;
  rating: number;
}

export const REVIEWS: Review[] = [
  {
    name: "Andy K.",
    date: "Mar 8",
    service: "Doggy Day Care",
    text: "Stephanie is really good with communicating clearly and within a few minutes. She's easy to work with and appears to make Gunner comfortable which makes us comfortable having her care for him.",
    rating: 5,
  },
  {
    name: "Ethan A.",
    date: "Jul 21",
    service: "Drop-In Visits",
    text: "Highly recommend. Very thoughtful in care of dog. Great communication.",
    rating: 5,
  },
  {
    name: "Andy K.",
    date: "Jun 15",
    service: "Doggy Day Care",
    text: "Stephanie is communicative and reliable. We appreciate her care in taking care of Gunner and her flexibility. We hope to have her take care of him again in the future.",
    rating: 4,
  },
  {
    name: "Lily N.",
    date: "Oct 13",
    service: "Boarding",
    text: "Stephanie was a complete pro when it comes to shy, over protective fur babies like my, Sandy! I loved her patience and willing to help Sandy come out of her shell. And her dynamic duo sidekicks, Simba and Aspen were that extra nudge Sandy needed to \"come out and play in the hay\" Adorbs!!! Thanks, Stephanie, Simba and Aspen! Look forward to future slumber parties with our fur babies.",
    rating: 5,
  },
  {
    name: "Mark M.",
    date: "Sep 28",
    service: "Drop-In Visits",
    text: "Stephanie took great care of my cat Joey complete with pictures everyday and letting me know how she was holding up at home!",
    rating: 5,
  },
  {
    name: "Rory P.",
    date: "Jul 24",
    service: "Drop-In Visits",
    text: "Stephanie took great care of our cat Callisto.",
    rating: 5,
  },
  {
    name: "Tiffany D.",
    date: "Apr 16",
    service: "Dog Walking",
    text: "I consistently book Steph for Ponzu's services. She sends a lot of pictures and is descriptive with her updates after walking Ponzu. She's super reliable and is willing to make sure my boy is comfortable and well stocked up on water, food and treats :)",
    rating: 5,
  },
  {
    name: "Jordan C.",
    date: "Apr 4",
    service: "Boarding",
    text: "Stephanie did a fantastic job watching Arthur, my Goldendoodle. He can be anxious and shy when I'm gone, but he loved Stephanie and her dogs/cats so much he didn't even want to leave! I will definitely be boarding him with Stephanie again.",
    rating: 5,
  },
  {
    name: "Sandi L.",
    date: "Mar 12",
    service: "Dog Walking",
    text: "Stephanie is wonderful. I have booked her several times and she is always reliable, communicative and loving to my dogs. They are happy to see her and enjoy their time with her. I am thankful my precious pups are in good hands with Stephanie.",
    rating: 5,
  },
  {
    name: "Tiffany D.",
    date: "Feb 26",
    service: "Dog Walking",
    text: "Steph is so sweet and makes sure my baby receives a lot of tender love and care when I'm away. I'm a repeated client and recommend her to anyone looking for a Rover sitter/walker to be in great hands.",
    rating: 5,
  },
  {
    name: "Claire B.",
    date: "Feb 4",
    service: "Drop-In Visits",
    text: "Stephanie is AMAZING! She always takes such good care of our animals!",
    rating: 5,
  },
  {
    name: "Cathy L.",
    date: "Jan 21",
    service: "Doggy Day Care",
    text: "This was Diesel's second time with Stephanie for daycare and I'm glad he has some friends to hang out with! I appreciate you taking great care of him for me!",
    rating: 5,
  },
  {
    name: "David C.",
    date: "Jan 18",
    service: "Dog Walking",
    text: "Chico came back exhausted from his hour walk with Stephanie. Can't wait for the next one!",
    rating: 5,
  },
  {
    name: "Tiffany D.",
    date: "Jan 15",
    service: "Dog Walking",
    text: "Stephanie is so sweet and caring! She was able to fit me in last minute for a morning walk. Definitely recommend Steph for your baby's needs.",
    rating: 5,
  },
  {
    name: "Ra R.",
    date: "Dec 29",
    service: "Boarding",
    text: "Stephanie was very accommodating and very communicative before, during, and after our pet's 3 day stay. She sent pics throughout the stay so we felt very connected even though were miles away. Great experience - we will definitely bring Roxy back during our next trip!!",
    rating: 5,
  },
  {
    name: "Ava K.",
    date: "Dec 15",
    service: "Dog Walking",
    text: "Stephanie was able to help me out last minute to walk my dog. She is very responsive to messages on Rover.",
    rating: 5,
  },
  {
    name: "Lucy S.",
    date: "Nov 16",
    service: "Dog Walking",
    text: "I always use Stephanie to walk our energetic lab as he loves her and you can tell she genuinely loves dogs!",
    rating: 5,
  },
  {
    name: "Letty G.",
    date: "Nov 11",
    service: "Dog Walking",
    text: "Stephanie is wonderful with my dog Penny. We know they have a wonderful relationship when I came back from a business trip and Penny waits for Stephanie by the door at around walk time. Will continue working with Stephanie. Cheers!",
    rating: 5,
  },
  {
    name: "Kendra C.",
    date: "Oct 31",
    service: "Drop-In Visits",
    text: "Stephanie was amazing with Oakley, he took a liking to her really quickly and I loved the detailed report cards. She was also communicative and quick to respond to messages. Would highly recommend!",
    rating: 5,
  },
  {
    name: "Katie B.",
    date: "Oct 23",
    service: "Drop-In Visits",
    text: "Stephanie was so communicative, attentive, and caring. We were nervous to go out of town, but Stephanie put us at ease. She documented each visit so thoroughly, and gave us updates on how our pup was doing. She was so nice and I was so grateful that she took such good care of our pup.",
    rating: 5,
  },
];

export const REVIEW_STATS = {
  totalReviews: 101,
  averageRating: 5.0,
  repeatClients: 38,
  yearsExperience: 10,
  roverProfileUrl: "https://www.rover.com/promos/stephw78932/",
};

export const SERVICE_FILTERS = [
  "All",
  "Dog Walking",
  "Drop-In Visits",
  "Boarding",
  "Doggy Day Care",
] as const;
