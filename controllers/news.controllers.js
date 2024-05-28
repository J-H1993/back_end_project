const {selectTopics} = require('../models/news.models')

exports.sendTopics = (req, res, next) => {
    selectTopics().then((topics)=>res.status(200).send({topics}))
    .catch(next)
}