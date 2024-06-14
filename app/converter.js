const spreadsheet_id = "1lgLIT3prMzMk_z8ea0IPX7zp5zIYU8eUzQer8HV6xTA";
const tab_name = "Sheet1";
const api_key = "AIzaSyDdPcUvHKUFXGFNq0MZgbJEeOjtzq4U07w";

var dataUrl =
  "https://sheets.googleapis.com/v4/spreadsheets/" +
  spreadsheet_id +
  "/values/" +
  tab_name +
  "?alt=json&key=" +
  api_key;

const ConvertBets = async () => {
  const allBets = [];
  const bets = await fetch(dataUrl).then((res) => res.json());

  bets.values?.map((bet) => {
    const [user, ...bets] = bet;
    const betsToArr = bets.map((bet, index) => {
      if (user === "Navn") return null;
      return {
        user: user,
        userid: user
          .toLowerCase()
          .replace(" ", "_")
          .replace("æ", "ae")
          .replace("ø", "oe")
          .replace("å", "aa"),
        id: index + 1,
        bet: bet,
      };
    });

    allBets.push(...betsToArr);
  });
  return allBets;
};

ConvertBets().then((res) => {
  // write to json file
  const fs = require("fs");
  // create a file named bets.js

  fs.writeFileSync(
    __dirname + "/data/bets.js",
    "export const bets = " + JSON.stringify(res, null, 2)
  );
  console.log("Done");
});
