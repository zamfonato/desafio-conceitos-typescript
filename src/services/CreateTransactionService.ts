import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

// Implementa a regra de negócio para criar uma transação
class CreateTransactionService {

  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {

    // RN01
    if(!['income','outcome'].includes(type)){
      throw new Error('Tipo de transação inválida'); // 400 
    }

    const { total } = this.transactionsRepository.getBalance();

    // RN02
    if ( type == "outcome" && total < value ){
      throw new Error('Balanço insuficiente'); // 400
    }

    // Com as condições satisfeitas pode criar a transação 
    const transaction = this.transactionsRepository.create({
      title, value, type
    });

    return transaction;
  }
}

export default CreateTransactionService;
