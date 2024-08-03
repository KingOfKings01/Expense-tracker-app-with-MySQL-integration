const Expense = require("../models/Expense");

exports.createExpense = async (req, res) => {
    try {
        const expense = new Expense(req.body);
        res.status(201).json(expense);
        expense.save()
    } catch (err) { 
        res.status(400).json({ message: err.message });
    }
}

exports.getExpensesById = async (req, res) => {
    try{
        const expense = await Expense.findByPk(req.params.id);
        if(!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getAllExpenses = async (req, res) => {
    try{
        const expenses = await Expense.findAll();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateExpense = async (req, res) => {
    try{
        const [updated] = await Expense.update(req.body, {
            where: { id: req.params.id }
        });

        // Check if any row was updated
        if (updated === 0) return res.status(404).json({ message: 'Expense not found' });

        res.json({ message: 'Expense updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteExpense = async (req, res) => {
    console.log(req)
    try{
        const deleted = await Expense.destroy({
            where: { id: req.params.id },
          });
          if (deleted) {
            res.status(204).send();
          } else {
            res.status(404).json({ message: 'Expense id not found' });
          }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}