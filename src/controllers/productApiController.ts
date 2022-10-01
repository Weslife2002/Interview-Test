import { NextFunction, Request, Response } from 'express';
import logger from '../core/logger';
import { Product } from '../models/product';

const productApiController = {
  listing: (req: Request, res: Response, next: NextFunction): void => {
    logger.info('retrieving product listing');
    let size: number = Number(req.query.size);
    if (Number.isNaN(size)) {
      size = 10;
    }
    if (size <= 0) {
      size = 10;
    } else if (size > 100) {
      size = 100;
    }
    let page: number = Number(req.query.page);
    if (Number.isNaN(page)) {
      page = 1;
    }
    if (page <= 0) {
      page = 1;
    }
    const sorting_field = typeof req.query.sort !== 'undefined' ? String(req.query.sort) : 'id';
    const sorting_order = typeof req.query.dir !== 'undefined' ? String(req.query.dir) : 'DESC';
    Product.findAndCountAll(
      {
        offset: (page - 1) * size,
        limit: size,
        order: [
          [sorting_field, sorting_order]
        ]
      })
      .then(result => {
        if (result.rows) {
          res.status(200).json({
            message : "OK",
            data: result.rows});
        } else {
          res.status(200).json([]);
        }
      })
      .catch(err => {
        logger.error(JSON.stringify(err));
        res.status(422).json({
          status: false,
          message: 'Fail retrieving data!',
          error: err,
        });
      });
  },

  retrieveByCode: (req: Request, res: Response, next: NextFunction): void => {
    logger.info('retrieving product by code');
    // FIXME
    Product.findOne(
    {
      where: {
        code: req.params.code
      }
    })
    .then(result => {
        if (result) {
          res.status(200).json({
            message: "OK",
            data: result});
        } else {
          res.status(200).json([]);
        }
      })
      .catch(err => {
        logger.error(JSON.stringify(err));
        res.status(422).json({
          status: false,
          message: 'Fail retrieving data!',
          error: err,
        });
      });
  },

  createProduct: (req: Request, res: Response, next: NextFunction): void => {
    logger.info('Create new product !!!');
    // FIXME
    Product.create({code: req.body.code,
                    name: req.body.name,
                    category : req.body.category,
                    brand : req.body.brand || '',
                    type : req.body.type || '',
                    description : req.body.description || ''
    })
    .then(result => {
      res.status(200).json({
        message : "OK",
        data : result});
    })
    .catch(err => {
      logger.error(JSON.stringify(err));
      res.status(422).json({
        status: false,
        message: 'Fail creating new product!',
        error: err,
      });
    });
  },

  updateProduct: (req: Request, res: Response, next: NextFunction): void => {
    logger.info('Update product !!!');
    // FIXME
    Product.update({name: req.body.name,
                    category : req.body.category,
                    brand : req.body.brand,
                    type : req.body.type,
                    description : req.body.description 
    },{
      where : {code: req.params.code},
      returning : true,
    })
    .then( () => {
      Product.findAndCountAll({
          where : {
            code : req.params.code
          }
        })
        .then(
          result =>{
            res.status(200).json({
              message : "OK",
              data: result.rows
            });
          }
        )
    })
    .catch(err => {
      logger.error(JSON.stringify(err));
      res.status(422).json({
        status: false,
        message: 'Fail updating product!',
        error: err,
      });
    });
  },

  deleteProduct: (req: Request, res: Response, next: NextFunction): void => {
    logger.info('Delete product !!!');
    // FIXME
    Product.findOne({
      where : {
        code : req.params.code
      }
    })
    .then(result =>{
      if(result){
        result.destroy;
        res.status(200).json({
          message: "OK",
          data: result
        })
      }
      else{
        res.status(404).json({
          status: false,
          message: 'Product code is not available!',
        });
      }
    })
    .catch(err =>{
      logger.error(JSON.stringify(err));
      res.status(422).json({
        status: false,
        message: 'Fail deleting product!',
        error: err,
      });
    })
    /*
    Product.destroy({
      where : {code: req.params.code},
    })
    .then(result => {
        res.status(200).json({
          message: 'OK',
          data: result
        });
    })
    .catch(err => {
      logger.error(JSON.stringify(err));
      res.status(422).json({
        status: false,
        message: 'Fail deleting product!',
        error: err,
      });
    });
    */
  },
};

export default productApiController;
