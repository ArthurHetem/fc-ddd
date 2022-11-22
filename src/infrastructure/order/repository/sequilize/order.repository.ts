import Order from '../../../../domain/checkout/entity/order';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll();

    return orderModels.map(
      (orderModel) =>
        // let order = new Order(orderModels.id, orderModels.customer_id, [
        //   orderModels.items.map((item) => ({
        //     id: item.id,
        //     name: item.name,
        //     price: item.price,
        //     productId: item.product_id,
        //     quantity: item.quantity,
        //   }))
        // ]);
        new Order(orderModel.id, orderModel.customer_id, [])
    );
  }
}
