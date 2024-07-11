import Person from "./Person.js";

export const Abuya = new Person("", "KH. Mahfudz Syaubari, MA");
export const person = [
  {
    man: new Person("Najah", "Muhammad Najah Mahfudz", {
      father: Abuya,
      mother: new Person("", "Nyai Hj. Shofiyah"),
    }),
    woman: new Person("Nadya", "Nadya Ummu Kultsum", {
      father: new Person("", "Drs. KH Muhammad Makmun"),
      mother: new Person("", "Nyai Hj. Qais Muhayyam"),
    }),
  },
  {
    man: new Person("Zain", "Zain Mahfudz", {
      father: Abuya,
      mother: new Person("", "Nyai Hj. Endang Nur Rohmawati"),
    }),
    woman: new Person("Nafisa", "Nafisa Alyana", {
      father: new Person("", "Prof. Dr. H. M. Nizarul Alim"),
      mother: new Person("", "Nyai Hj. Nina Hendriana"),
    }),
  },
];
