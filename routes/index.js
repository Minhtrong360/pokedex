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
  const { type, name, page, limit } = req.query;

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
  let skip = (Number(page) - 1) * Number(limit);

  let final = pokemonFilter.slice(skip, Number(limit) + skip);

  res.status(200).json(final);
});

router.get("/pokemons/:id", function (req, res, next) {
  const { id } = req.params;

  let idFilter = Number(id);

  let pokemonFilter = pokemons.data;

  let indexID = pokemonFilter
    .map((pokemon) => {
      return pokemon.id;
    })
    .indexOf(idFilter);

  let filterArray = {};
  if (1 < idFilter && idFilter < pokemons.totalPokemons) {
    filterArray = {
      pokemon: pokemonFilter[indexID],
      previousPokemon: pokemonFilter[indexID - 1],
      nextPokemon: pokemonFilter[indexID + 1],
    };
  }
  if (idFilter === 1) {
    filterArray = {
      pokemon: pokemonFilter[indexID],
      previousPokemon: pokemonFilter.slice(-1)[0],
      nextPokemon: pokemonFilter[indexID + 1],
    };
  }
  if (idFilter === pokemons.totalPokemons) {
    filterArray = {
      pokemon: pokemonFilter[indexID],
      previousPokemon: pokemonFilter[indexID - 1],
      nextPokemon: pokemonFilter.slice(1),
    };
  }

  if (idFilter > pokemons.totalPokemons) {
    pokemonFilter = pokemonFilter?.filter(
      (pokemon) =>
        pokemon.id === Number(idFilter) ||
        pokemon.id === Number(pokemons.totalPokemons - 1) ||
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
      throw error;
    }
    if (types?.length > 2) {
      const error = new Error("Pokémon can only have one or two types.");
      error.statusCode = 404;
      throw error;
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
      throw error;
    }

    let dataPokemons = JSON.parse(fs.readFileSync("./archive/pokemons.json"));

    if (dataPokemons?.data.find((pokemon) => pokemon.id === Number(id))) {
      const error = new Error("The Pokémon already exists.");
      error.statusCode = 500;
      throw error;
    }
    if (dataPokemons?.data.find((pokemon) => pokemon.name === name)) {
      const error = new Error("The Pokémon already exists.");
      error.statusCode = 500;
      throw error;
    }

    const newPokemon = {
      id: Number(id),
      name: name,
      types: types,
      height: faker.datatype.number({ max: 100 }),
      weight: faker.datatype.number({ max: 100 }),
      url: url,
      description: faker.company.catchPhrase(),
      abilities: faker.company.catchPhraseAdjective(),
    };
    res.status(200).send(newPokemon);

    dataPokemons.data.push(newPokemon);
    dataPokemons.totalPokemons = dataPokemons.data.length;

    fs.writeFileSync("./archive/pokemons.json", JSON.stringify(dataPokemons));
  } catch (error) {
    // res.status(error.statusCode).send(error.message);
    next(error);
  }
});

module.exports = router;
