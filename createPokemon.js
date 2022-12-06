const fs = require("fs");
const csv = require("csvtojson");
const { faker } = require("@faker-js/faker");

const createPokemon = async () => {
  let newData = await csv().fromFile("./archive/pokemon.csv");
  let data = JSON.parse(fs.readFileSync("./archive/pokemons.json"));

  // for (let i = 0; i < 819; i++) {
  //   let dataImg = Array.from(fs.readFile(`./archive/pokemon/${i + 1}.png`));
  //   console.log("dataImg", dataImg.length);
  // }

  // let dataImg;

  // const generateImg = (width, height, index) => {
  //   return (
  //     <div className="square">
  //       <img
  //         key={index + 1}
  //         id={index + 1}
  //         src={`.archive/pokemon/${index + 1}.png`}
  //         width={width}
  //         height={height}
  //         alt="PNG"
  //       />
  //     </div>
  //   );
  // };

  // for (let i = 0; i < 819; i++) {
  //   dataImg.push(generateImg("50px", "60px", i));
  // }

  // console.log("ảnh", dataImg.length);

  newData = newData.slice(0, 721).map((e, i) => {
    if (i < 721) {
      return {
        id: Number(i + 1),
        name: e.Name,
        types: [e.Type1.toLowerCase(), e.Type2?.toLowerCase()],
        height: faker.datatype.number({ max: 100 }),
        weight: faker.datatype.number({ max: 100 }),
        url: `http://localhost:5000/images/${i + 1}.png`,
        description: faker.company.catchPhrase(),
        abilities: faker.company.catchPhraseAdjective(),
      };
    }
  });

  data.data = newData;
  data.totalPokemons = newData.length;
  fs.writeFileSync("./archive/pokemons.json", JSON.stringify(data));
};

createPokemon();
