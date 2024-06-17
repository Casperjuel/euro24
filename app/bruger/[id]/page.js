/* eslint-disable @next/next/no-img-element */
import { Euro24matches, flags } from "../../data/matches";

import { bets } from "../../data/bets";
import { getResults } from "../../page";
import styles from "../../page.module.scss";

export default async function User({ params: { id } }) {
  const allBets = await bets;
  const userBets = allBets.filter((bet) => bet.userid === id);
  const matches = await getResults();

  const user = {
    name: userBets[0].user,
    userid: userBets[0].userid,
    points: userBets.reduce((acc, bet) => {
      const match = matches.find((match) => match.id === bet.id);
      if (match.result) {
        return acc + (bet.bet === match.result.toString() ? 1 : 0);
      }
      return acc;
    }, 0),
  };

  const mergeMatches = userBets.map((bet) => {
    return {
      ...bet,
      match: matches.find((match) => match.id === bet.id),
    };
  });

  return (
    <main className={styles.main}>
      <h1>
        {user.name} - {user.points} points
      </h1>
      <br />
      <br />
      <br />
      <div className={styles.grid}>
        {mergeMatches.map((bet) => (
          <article key={bet.id} className={styles.card}>
            <div className={styles.correct}>
              {bet.match.result
                ? bet.bet === bet.match.result
                  ? "✅"
                  : "❌"
                : "❓"}
            </div>
            <h2>
              <span
                style={{
                  color:
                    bet.bet === "1"
                      ? "green"
                      : bet.bet === "2"
                      ? "red"
                      : "grey",
                }}
              >
                {bet.match.home}
              </span>{" "}
              <span className={styles.seperator}>vs</span>
              <span
                style={{
                  color:
                    bet.bet === "2"
                      ? "green"
                      : bet.bet === "1"
                      ? "red"
                      : "grey",
                }}
              >
                {bet.match.away}
              </span>{" "}
            </h2>
            {new Date(bet.match.time).toDateString()}
          </article>
        ))}
      </div>
    </main>
  );
}
