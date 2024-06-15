import { Euro24matches, flags } from "./data/matches";

import Image from "next/image";
import Link from "next/link";
import { bets } from "./data/bets";
import styles from "./page.module.scss";
import { use } from "react";

export default async function Home() {
  const allBets = await bets;
  const findUsers = allBets.map((bet) => bet.user);
  findUsers.sort();

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
        const match = Euro24matches.find((match) => match.id === bet.id);
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
          {Euro24matches.map((match) => (
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
                <p>
                  Afviklet
                  <br />
                  {
                    allBets
                      .filter((bet) => bet.id === match.id)
                      .filter((bet) => bet.bet === match.result).length
                  }
                  / {users.length} har gættet rigtigt
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
