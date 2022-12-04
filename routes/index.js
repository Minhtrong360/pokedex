var express = require("express");
var router = express.Router();
const fs = require("fs");
const csv = require("csvtojson");
const pokemons = require("../archive/pokemons.json");
const { faker } = require("@faker-js/faker");

/* GET home page. */

router.get("/", function (req, res, next) {
  res.send("OK");
});

router.get("/pokemons", function (req, res, next) {
  const { type, name } = req.query;

  let pokemonFilter = pokemons.data;
  if (type) {
    pokemonFilter = pokemonFilter?.filter((pokemon) =>
      pokemon?.types?.includes(type.toLowerCase())
    );
  }
  if (name) {
    pokemonFilter = pokemonFilter?.filter((pokemon) =>
      pokemon?.name?.includes(name.toLowerCase())
    );
  }
  res.status(200).json(pokemonFilter);
});

router.get("/pokemons/:id", function (req, res, next) {
  const { id } = req.params;

  let idFilter = Number(id);

  let pokemonFilter = pokemons.data;
  let filterArray = {};
  if (1 < idFilter && idFilter < pokemons.totalPokemons) {
    pokemonFilter = pokemonFilter?.filter(
      (pokemon) =>
        pokemon.id === idFilter ||
        pokemon.id === idFilter - 1 ||
        pokemon.id === idFilter + 1
    );
    filterArray = {
      pokemon: pokemonFilter[1],
      previousPokemon: pokemonFilter[0],
      nextPokemon: pokemonFilter[2],
    };
  }
  if (idFilter === 1) {
    pokemonFilter = pokemonFilter?.filter(
      (pokemon) =>
        pokemon.id === idFilter ||
        pokemon.id === Number(pokemons.totalPokemons) ||
        pokemon.id === idFilter + 1
    );
    filterArray = {
      pokemon: pokemonFilter[0],
      previousPokemon: pokemonFilter[2],
      nextPokemon: pokemonFilter[1],
    };
  }
  if (idFilter === pokemons.totalPokemons) {
    pokemonFilter = pokemonFilter?.filter(
      (pokemon) =>
        pokemon.id === Number(pokemons.totalPokemons) ||
        pokemon.id === idFilter - 1 ||
        pokemon.id === Number(1)
    );
    filterArray = {
      pokemon: pokemonFilter[2],
      previousPokemon: pokemonFilter[1],
      nextPokemon: pokemonFilter[0],
    };
  }

  res.status(200).json(filterArray);
});

router.post("/pokemons", function (req, res, next) {
  const { name, id, types, url } = req.body;
  try {
    if (!id || !name || !types || !url) {
      const error = new Error("Missing required data.");
      error.statusCode = 404;
      next(error);
    }
    if (types?.length > 2) {
      const error = new Error("Pokémon can only have one or two types.");
      error.statusCode = 404;
      next(error);
    }

    const pokemonTypes = [
      "bug",
      "dragon",
      "fairy",
      "fire",
      "ghost",
      "ground",
      "normal",
      "psychic",
      "steel",
      "dark",
      "electric",
      "fighting",
      "flyingText",
      "grass",
      "ice",
      "poison",
      "rock",
      "water",
    ];
    if (!types?.map((type) => pokemonTypes.includes(type))) {
      const error = new Error("Pokémon’s type is invalid.");
      error.statusCode = 404;
      next(error);
    }

    let dataPokemons = JSON.parse(fs.readFileSync("./archive/pokemons.json"));

    pokemons?.data?.map((pokemon) => {
      if (id === pokemon.id || name === pokemon.name) {
        const error = new Error("The Pokémon already exists.");
        error.statusCode = 401;
        next(error);
      } else {
        const newPokemon = {
          id: id,
          name: name,
          types: types,
          height: height ? height : faker.datatype.number({ max: 100 }),
          weight: weight ? weight : faker.datatype.number({ max: 100 }),
          url: url,
          description: description ? description : faker.company.catchPhrase(),
          abilities: abilities
            ? abilities
            : faker.company.catchPhraseAdjective(),
        };
        res.status(200).send(newPokemon);

        dataPokemons.data.push(newPokemon);
        dataPokemons.totalPokemons = dataPokemons.data.length;

        fs.writeFileSync(
          "./archive/pokemons.json",
          JSON.stringify(dataPokemons)
        );
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
