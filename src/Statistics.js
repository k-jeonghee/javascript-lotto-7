import { PRIZES, WINNING_KEYS } from './constants/lotto.js';
import { OUTPUT, PROMPT } from './constants/messages.js';
import OutputProcessor from './OutputProcessor.js';

class Statistics {
  winningCounts = {
    [WINNING_KEYS.FIRST]: 0,
    [WINNING_KEYS.SECOND]: 0,
    [WINNING_KEYS.THIRD]: 0,
    [WINNING_KEYS.FOURTH]: 0,
    [WINNING_KEYS.FIFTH]: 0
  };

  #totalEarningsRate = 0;

  constructor(lottos, purchasePrice, winningNumbers, bonusNumber) {
    this.lottos = lottos;
    this.purchasePrice = purchasePrice;
    this.winningNumbers = winningNumbers;
    this.bonusNumber = bonusNumber;
    this.#checkMatches();
    this.#calculateTotalEarningsRate();
  }

  #checkMatches() {
    this.lottos.forEach((lotto) => {
      const matchedNumbers = lotto.get().filter((num) => this.winningNumbers.includes(String(num))).length;
      const isBonusMatched = lotto.get().includes(this.bonusNumber);
      this.#calculateWinning(matchedNumbers, isBonusMatched);
    });
  }

  #calculateWinning(matchedNumbers, isBonusMatched) {
    if (matchedNumbers < 3) {
      return;
    }
    let winning = '';
    if (matchedNumbers === 6) {
      winning = WINNING_KEYS.FIRST;
    } else if (matchedNumbers === 5 && isBonusMatched) {
      winning = WINNING_KEYS.SECOND;
    } else if (matchedNumbers === 5) {
      winning = WINNING_KEYS.THIRD;
    } else if (matchedNumbers === 4) {
      winning = WINNING_KEYS.FOURTH;
    } else if (matchedNumbers === 3) {
      winning = WINNING_KEYS.FIFTH;
    }

    this.winningCounts[winning] += 1;
  }

  #calculateTotalEarningsRate() {
    const totalPrize = Object.keys(this.winningCounts).reduce(
      (total, winning) => total + this.winningCounts[winning] * PRIZES[winning],
      0
    );
    this.#totalEarningsRate = (Math.round((totalPrize / this.purchasePrice) * 1000) / 10).toFixed(1);
  }

  result() {
    OutputProcessor.print(`${PROMPT.WINNING_OUTPUT}
${OUTPUT.FIFTH_WINNING(this.winningCounts.fifth)}
${OUTPUT.FOURTH_WINNING(this.winningCounts.fourth)}
${OUTPUT.THIRH_WINNING(this.winningCounts.third)}
${OUTPUT.SECOND_WINNING(this.winningCounts.second)}
${OUTPUT.FIRST_WINNING(this.winningCounts.first)}
${OUTPUT.TOTAL_EARNINGS_RATE(this.#totalEarningsRate)}
`);
  }
}

export default Statistics;