import { Euro24matches, flags } from "./data/matches";

import Image from "next/image";
import Link from "next/link";
import { bets } from "./data/bets";
import styles from "./page.module.scss";

export const getResults = async () => {
  const spreadsheet_id = "1lgLIT3prMzMk_z8ea0IPX7zp5zIYU8eUzQer8HV6xTA";
  const tab_name = "resultater";
  const api_key = "AIzaSyDdPcUvHKUFXGFNq0MZgbJEeOjtzq4U07w";

  var dataUrl =
    "https://sheets.googleapis.com/v4/spreadsheets/" +
    spreadsheet_id +
    "/values/" +
    tab_name +
    "?alt=json&key=" +
    api_key;

  const data = await fetch(dataUrl).then((res) => res.json());
  const [ids, results] = data.values;

  const matches = [];
  ids.forEach((id, index) => {
    const match = Euro24matches.find((match) => match.id.toString() === id);
    if (match) {
      match.result = results[index] === "-" ? null : results[index];
      matches.push(match);
    }
  });

  return matches;
};

export default async function Home() {
  const allBets = await bets;
  const findUsers = allBets.map((bet) => bet.user);
  findUsers.sort();
  const Matches = await getResults();

  const users = [...new Set(findUsers)].map((user) => {
    return {
      name: user,
      userid: user
        .toLowerCase()
        .replaceAll(" ", "_")
        .replaceAll("æ", "ae")
        .replaceAll("ø", "oe")
        .replaceAll("å", "aa"),
      points: 0,
    };
  });

  const calculatePoints = (bet, result) => {
    if (bet === result) return 1;
    return 0;
  };
  // calculate points for each user
  users.forEach((user) => {
    allBets.forEach((bet) => {
      if (bet.user === user.name) {
        const match = Matches.find((match) => match.id === bet.id);
        if (match.result) {
          user.points += calculatePoints(bet.bet, match.result.toString());
        }
      }
    });
  });

  const sortedUsers = users.sort(
    (a, b) => b.points - a.points || a.name - b.name
  );
  return (
    <main className={styles.main}>
      <h1>Svogerslev EURO 24 scoreboard</h1>
      <br />
      <br />

      <div className={styles.flex}>
        <div>
          <br />
          <ul className={styles.scoreboard}>
            {sortedUsers.map((user) => {
              return (
                <li key={user.userid}>
                  <Link href={`/bruger/${user.userid}`}>
                    {user.name} - {user.points} point
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={[styles.grid, styles.matches].join(" ")}>
          {Matches.map((match) => (
            <div key={match.id} className={styles.card}>
              <h2>
                <span
                  style={{
                    color:
                      match.result === "1"
                        ? "green"
                        : match.result === "2"
                        ? "red"
                        : "grey",
                  }}
                >
                  <Image
                    src={flags[match.home]}
                    alt="match"
                    width={40}
                    height={20}
                    style={
                      match.result && {
                        opacity: match.result === "1" ? 1 : 0.2,
                      }
                    }
                  />{" "}
                  {match.home}
                </span>{" "}
                <span className={styles.seperator}>vs</span>
                <span
                  style={{
                    color:
                      match.result === "2"
                        ? "green"
                        : match.result === "1"
                        ? "red"
                        : "grey",
                  }}
                >
                  <Image
                    src={flags[match.away]}
                    alt="match"
                    width={40}
                    height={30}
                    style={
                      match.result && {
                        opacity: match.result === "2" ? 1 : 0.2,
                      }
                    }
                  />
                  {match.away}
                </span>{" "}
              </h2>
              {match.result ? (
                <p className={styles.hover}>
                  Afviklet
                  <br />
                  {
                    allBets
                      .filter((bet) => bet.id === match.id)
                      .filter((bet) => bet.bet === match.result).length
                  }
                  / {users.length} har gættet rigtigt
                  <span className={styles.tooltip} style={{
                    display: 'none'
                  }}>
                    {allBets
                      .filter((bet) => bet.id === match.id)
                      .filter((bet) => bet.bet === match.result).map((bet) => (
                        <span key={bet.user}>{bet.user}</span>
                      ))}
                  </span>
                </p>
              ) : (
                <p>Starter {new Date(match.time).toDateString()}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
