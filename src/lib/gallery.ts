export interface GalleryImage {
  src: string;
  alt: string;
  tag: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: "/images/steph-hugging-dog.jpeg", alt: "Stephanie hugging a dog in the backyard", tag: "Daycare" },
  { src: "/images/steph-frenchie-couch.jpeg", alt: "Stephanie with French Bulldog on the couch", tag: "House Sitting" },
  { src: "/images/two-dogs-trail.jpeg", alt: "Two dogs on a scenic sunset trail", tag: "Dog Walking" },
  { src: "/images/three-dogs-walk.jpeg", alt: "Three dogs on a group walk", tag: "Dog Walking" },
  { src: "/images/white-poodle-walk.jpeg", alt: "White poodle on a walk", tag: "Dog Walking" },
  { src: "/images/apricot-poodle-walk.jpeg", alt: "Apricot poodle with pink harness on a walk", tag: "Dog Walking" },
  { src: "/images/yellow-lab-walk.jpeg", alt: "Yellow Lab looking up on a walk", tag: "Dog Walking" },
  { src: "/images/husky-purple-vest.jpeg", alt: "Husky mix in purple vest on a trail", tag: "Dog Walking" },
  { src: "/images/brindle-dog-grass.jpeg", alt: "Brindle dog resting on the grass", tag: "Dog Walking" },
  { src: "/images/black-dog-red-harness.jpeg", alt: "Black dog with red harness in the park", tag: "Dog Walking" },
  { src: "/images/german-shepherd-smile.jpeg", alt: "German Shepherd smiling on a dirt trail", tag: "Dog Walking" },
  { src: "/images/happy-pitbull.jpeg", alt: "Happy pitbull smiling indoors", tag: "Boarding" },
  { src: "/images/smiling-black-dog.jpeg", alt: "Smiling black dog indoors", tag: "Boarding" },
  { src: "/images/happy-labs-home.jpeg", alt: "Happy Labs greeting at home", tag: "House Sitting" },
  { src: "/images/cavaliers-in-car.jpeg", alt: "Two Cavalier King Charles in the car", tag: "Transportation" },
  { src: "/images/white-poodle-car.jpeg", alt: "White poodle riding in the car", tag: "Transportation" },
  { src: "/images/dogs-daycare-group.jpeg", alt: "Group of dogs hanging out at daycare", tag: "Daycare" },
  { src: "/images/shepherd-puppy-turf.jpeg", alt: "Shepherd puppy playing on turf", tag: "Daycare" },
  { src: "/images/dachshund-puppy.jpeg", alt: "Dachshund puppy looking up", tag: "Drop-In" },
  { src: "/images/cozy-dog-blanket.jpeg", alt: "Cozy dog snuggled in a blanket", tag: "Boarding" },
  { src: "/images/gray-cat.jpeg", alt: "Gray and white cat at home", tag: "Drop-In" },
  { src: "/images/orange-tabby-cat.jpeg", alt: "Orange tabby cat on a cat tree", tag: "Drop-In" },
  { src: "/images/blue-eyed-cat-bed.jpeg", alt: "Blue-eyed cat nestled in bed", tag: "House Sitting" },
  { src: "/images/shiba-inu-grass.jpeg", alt: "Shiba Inu relaxing on the grass", tag: "Dog Walking" },
  { src: "/images/steph-bulldog-selfie.jpeg", alt: "Stephanie selfie with English Bulldog", tag: "Dog Walking" },
  { src: "/images/two-labs-indoors.jpeg", alt: "Two Labs looking up indoors", tag: "House Sitting" },
  { src: "/images/beagle-on-bed.jpeg", alt: "Beagle mix cozy on a dog bed", tag: "Boarding" },
  { src: "/images/steph-dog-park.jpeg", alt: "Stephanie with dog at the park", tag: "Dog Walking" },
  { src: "/images/husky-purple-harness-walk.jpeg", alt: "Husky in purple harness on a walk", tag: "Dog Walking" },
  { src: "/images/beagle-chin-scratch.jpeg", alt: "Beagle getting chin scratches", tag: "Drop-In" },
  { src: "/images/pitbull-red-leash-walk.jpeg", alt: "Pitbull on red leash walking", tag: "Dog Walking" },
  { src: "/images/husky-park-resting.jpeg", alt: "Husky resting at the park", tag: "Dog Walking" },
  { src: "/images/saint-bernard-walk.jpeg", alt: "Saint Bernard on a leafy walk", tag: "Dog Walking" },
  { src: "/images/shiba-inu-indoors.jpeg", alt: "Shiba Inu sitting indoors", tag: "Boarding" },
  { src: "/images/boston-terrier-closeup.jpeg", alt: "Boston Terrier closeup looking at camera", tag: "Drop-In" },
  { src: "/images/corgi-looking-up.jpeg", alt: "Corgi looking up adorably", tag: "Daycare" },
  { src: "/images/shih-tzu-walk.jpeg", alt: "Shih Tzu on a neighborhood walk", tag: "Dog Walking" },
  { src: "/images/four-dogs-group-walk.jpeg", alt: "Four dogs on a group walk", tag: "Dog Walking" },
];

export const GALLERY_TAGS = [
  "All",
  "Dog Walking",
  "Daycare",
  "Boarding",
  "House Sitting",
  "Drop-In",
  "Transportation",
] as const;
