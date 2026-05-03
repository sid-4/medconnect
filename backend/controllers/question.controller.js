const Question = require('../models/Question');

exports.create = async (req, res) => {
  try {
    const question = new Question({
      title: req.body.title,
      description: req.body.description,
      author: req.user.id
    });
    await question.save();
    await question.populate('author', 'username');
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username');
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    question.title = req.body.title || question.title;
    question.description = req.body.description || question.description;
    await question.save();
    await question.populate('author', 'username');
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await question.deleteOne();
    res.json({ message: 'Question deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
