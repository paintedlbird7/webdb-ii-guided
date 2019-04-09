const router = require('express').Router();

const knex = require('knex')

const knexConfig = {
  client: 'sqlite3', // the npm module we installed
  useNullAsDefault: true, //Needed when working with sqlite./
  connection: {
    filename: './data/rolex.db3' // need to create the data folder & the data base file
  }
}

const db = knex(knexConfig);

router.get('/', (req, res) => {
  // get the roles from the database
  db('roles') // returns a promise
  .then(roles => {
    res.status(200).json(roles)
  })
  .catch(error => {
    res.status(500).json(error)
  })
});


router.get('/:id', (req, res) => {
  // retrieve a role by id
  db('roles') // returns a promise
    .whereExists({id: req.params.id})
    .first ()
    .then (role => {
      if(role) {
        res.status(200).json(role)
      } else {
        res.status(404).json({ message: 'Role not found'})
        }
      })
      .catch(err => {
        res.status(500).json(error)
      })
    })



router.post('/', async (req, res) => {
  // add a role to the database
  try {
    const [id] = await db('roles').insert(req.body)
    const role = await db('roles')
    .where({ id })
    .first()

    res.status(201).json(role)
  } catch (error) {
    res.status(500).json(error)
  }
});




router.put('/:id',  (req, res) => {
  // update roles
  db('roles')
  .where({ id: req.params.id})
  .update(req.body)
  .then(count => {
    if (count > 0) {
      db('roles')
      .where({ id: req.params.id })
      .first()
      .then(role => {
        res.status(200).json(role)
      })
    } else {
      res.status(404).json({ message: 'Role not found'})
    }   
  })
  .catch(error => {
    res.status(500).json(error)

  })
});




router.delete('/:id', (req, res) => {
  // remove roles (inactivate the role)
  db('roles')
  .where({ id: req.params.id })
  .del()
  .then(count => {
    if (count > 0) {
      res.status(204).end()
    }else{
      res.status(404).json ({ message: 'Role not found'})

    }
    })
    .catch(error => {
      res.status(500).json(error);
    })

});

module.exports = router;
