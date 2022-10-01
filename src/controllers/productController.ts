import { NextFunction, Request, Response } from 'express';
import { Product } from '../models/product';

const productController = {
  index: async (req: Request, res: Response, next: NextFunction) => {
    let products = await Product.findAll();
    let message: string = '';
    if (!Array.isArray(products)) {
      products = [];
      message = 'Fail to retrieve records.';
    }
    res.render('pages/product/index', {
      message,
      products,
    });
  },

  productPagination: async (req: Request, res: Response, next: NextFunction) => {

    console.log("ARE YOU OK ?")
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
    const sortingField = typeof req.query.sort !== 'undefined' ? String(req.query.sort) : 'id';
    const sortingOrder = typeof req.query.dir !== 'undefined' ? String(req.query.dir) : 'ASC';
    let lastPage = Math.ceil((await Product.findAll()).length/size);
    let { count, rows } = await Product.findAndCountAll(
      {
        offset: (page - 1) * size,
        limit: size,
        order: [
          [sortingField, sortingOrder]
        ]
      }
    )
    let message: string = '';
    let products = rows;
    res.render('pages/product/page-pagination', {
      message,
      products,
      page,
      size,
      lastPage
    });
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    // FIXME
    res.render('pages/product/create', {
      message: 'not implemented',
    });
  },

  store: async (req: Request, res: Response, next: NextFunction) => {
    // FIXME
    res.render('pages/product/error', {
      message: 'not implemented',
    });
  },

  show: async (req: Request, res: Response, next: NextFunction) => {
    // FIXME
    res.render('pages/product/error', {
      message: 'not implemented',
    });
  },

  edit: async (req: Request, res: Response, next: NextFunction) => {
    // FIXME
    
    res.render('pages/product/edit', {
      productCode: req.params.code,
      message : ""
    });
  },

  afterEdit: async (req: Request, res: Response, next: NextFunction) => {
    let message = "";
    console.log(req.params.code);
    console.log(req.body.name);

    if(typeof req.body !== "undefined"){
      Product.update({
        name:req.body.name,
        category : req.body.category,
        brand : req.body.brand,
        type : req.body.type,
        description : req.body.description 
      },{
        where : {
          code: req.params.code
        }
      })
      .then(
        () =>{
          res.render('pages/product/edit', {
            productCode: req.params.code,
            message : "Product has been updated!"
          });
        }
      )
      .catch(err =>{
        res.render('pages/product/edit', {
          productCode: req.params.code,
          message : "Cannot update the product!"
        });
      })
    }
  },

  afterCreate: async (req: Request, res: Response, next: NextFunction) => {
    let message = "";

    if(typeof req.body !== "undefined"){
      Product.update({
        name:req.body.name,
        category : req.body.category,
        brand : req.body.brand,
        type : req.body.type,
        description : req.body.description 
      },{
        where : {
          code: req.params.code
        }
      })
      .then(
        () =>{
          res.render('pages/product/create', {
            productCode: req.params.code,
            message : "Product has been updated!"
          });
        }
      )
      .catch(err =>{
        res.render('pages/product/create', {
          productCode: req.params.code,
          message : "Cannot update the product!"
        });
      })
    }
  },


  update: async (req: Request, res: Response, next: NextFunction) => {
    // FIXME
    res.render('pages/product/error', {
      message: 'not implemented',
    });
  },

  destroy: async (req: Request, res: Response, next: NextFunction) => {
    // FIXME
    res.render('pages/product/error', {
      message: 'not implemented',
    });
  },
};

export default productController;
