import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

// Objeto de Transferência de Dados
interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

// Quem conecta a rota com a persistência dos dados
class TransactionsRepository {

  private transactions: Transaction[];

  constructor() {
    // Armazena todas as transações em memória
    this.transactions = [];
  }

  // Retorna todas as transações
  public all(): Transaction[] {
    return this.transactions;
  }

  // Retorna o balanço das transações
  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      // Accumulator: Acumula valores durante a redução
      // Transaction: Objeto iterado na redução
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case "income":
            accumulator.income += transaction.value;
            break;
          case "outcome":
            accumulator.outcome += transaction.value;
            break;
          default:
            break;
        }
        return accumulator;
      }, 
      // Objeto inicializado com 0
      {
      income: 0,
      outcome: 0,
      total: 0
    });    
    const total = income - outcome;
    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    // Cria o registro usando o modelo do dado
    const transaction = new Transaction({
      title,
      value,
      type
    });
    // Adiciona na persistência
    this.transactions.push(transaction);
    // Retorna item recém adicionado
    return transaction;
  }
}

export default TransactionsRepository;
