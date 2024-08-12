let db = `
48.30,32.16,Кропивницький,200000,
44.38,34.33,Алушта,31440,
49.46,30.17,Біла Церква,200131,
49.54,28.49,Бердичів,87575,#некоммент

#
46.49,36.58,#Бердянськ,121692,
49.15,28.41,Вінниця,356665,
#45.40,34.29,Джанкой,43343,
50.45,30.52,Київ,2967360,
49.83,24.02,Львів,721301,
46.48,30.73,Одеса,1017022,
49.99,36.23,Харків,1437000,
47.90,33.38,Кривий Ріг,612750,
48.92,24.71,Івано-Франківськ,238049,
49.83,30.13,Умань,85354,

# в цьому файлі три рядки-коментаря :)
`;

function parser(csvText){
  let cities = csvText.split("\n")
                      .filter((str) => str && str[0] !== '#' && str.split(',').length > 3)
                      .map((item) => {
                        const [x, y, name, population] = item.split(',', 4);
                        return {x: x, y: y, name: name.trim(), population: +population};
                      })
                      .sort((a,b)=>{return b.population-a.population})
                      .slice(0, 10)
                      .reduce((obj, city, index) => {
                        obj[city.name] = {
                          population: city.population,
                          rating: index + 1,
                        };
                        return obj;
                      }, {});
  return (text) => {
    let arrayWords = text.split(/[\s,.!?]+/);
    let uniqeArrWords = [...new Set(arrayWords)];
    uniqeArrWords.map((word) => {
      let city = cities[word];
      if(cities[word]){
        let rating = city.rating;
        let population = city.population;
        text = text.replaceAll(word, `${word}(${rating} місце в ТОП-10 найбільших міст України, населення ${population} ${populationFormatter(population)})`)
      }
    })
    return text;
  }
}

function populationFormatter(population){
  if(population % 10 === 1 && population % 100 !== 11){
    return "людина";
  } else if (
    [2, 3, 4].includes(population % 10) &&
    ![12, 13, 14].includes(population % 100)
  ) {
    return "людини"
  } else {
    return "людей"
  }
}


let textCorrectionFunc = parser(db);
let inputText = document.getElementById('input-text');
let changeTextBtn = document.getElementById('change-text-btn');
let outputText = document.getElementById('output-text');

changeTextBtn.addEventListener('click', ()=>{
  let text = inputText.value;
  let correctText = textCorrectionFunc(text);
  outputText.innerHTML = correctText;
})




