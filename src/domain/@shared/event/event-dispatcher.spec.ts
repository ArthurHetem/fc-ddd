import Customer from '../../customer/entity/customer';
import AddressChangedEvent from '../../customer/event/address-changed.event';
import CustomerCreatedEvent from '../../customer/event/customer-created.event';
import SendConsoleLogHandler from '../../customer/event/handler/send-console-log.handler';
import SendConsoleLog1Handler from '../../customer/event/handler/send-console-log1.handler.';
import SendConsoleLog2Handler from '../../customer/event/handler/send-console-log2.handler';
import Address from '../../customer/value-object/address';
import SendEmailWhenProductIsCreatedHandler from '../../product/event/handler/send-email-when-product-is-created.handler';
import ProductCreatedEvent from '../../product/event/product-created.event';
import EventDispatcher from './event-dispatcher';

describe('Domain events tests', () => {
  it('should register an event handler', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined();
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(1);

    eventDispatcher.register('CustomerCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent']).toBeDefined();
    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'].length).toBe(1);

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);
    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler);
  });

  it('should unregister an event handler', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);

    eventDispatcher.register('CustomerCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler);

    eventDispatcher.unregister('ProductCreatedEvent', eventHandler);
    eventDispatcher.unregister('CustomerCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined();
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(0);
    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent']).toBeDefined();
    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'].length).toBe(0);
  });

  it('should unregister all event handlers', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);

    eventDispatcher.register('CustomerCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeUndefined();
    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent']).toBeUndefined();
  });

  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventHandlerCustomer = new SendConsoleLog1Handler();
    const eventHandlerCustomer2 = new SendConsoleLog2Handler();
    const eventHandlerAddress = new SendConsoleLogHandler();

    const spyEventHandler = jest.spyOn(eventHandler, 'handle');
    const spyEventHandlerCustomer = jest.spyOn(eventHandlerCustomer, 'handle');
    const spyEventHandlerCustomer2 = jest.spyOn(eventHandlerCustomer, 'handle');
    const spyEventHandlerAddress = jest.spyOn(eventHandlerAddress, 'handle');

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);

    eventDispatcher.register('CustomerCreatedEvent', eventHandlerCustomer);

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandlerCustomer);

    eventDispatcher.register('CustomerCreatedEvent', eventHandlerCustomer2);

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandlerCustomer2);

    eventDispatcher.register('AddressChangedEvent', eventHandlerAddress);

    expect(eventDispatcher.getEventHandlers['AddressChangedEvent'][0]).toMatchObject(eventHandlerAddress);

    const productCreatedEvent = new ProductCreatedEvent({
      name: 'Product 1',
      description: 'Product 1 description',
      price: 10.0,
    });

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: 'Customer 1',
    });

    const customer = new Customer('1', 'Customer 1');
    const address = new Address('Street 1', 123, '13330-250', 'São Paulo');
    customer.Address = address;

    const addressChangedEvent = new AddressChangedEvent(customer);

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);
    eventDispatcher.notify(customerCreatedEvent);
    eventDispatcher.notify(addressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyEventHandlerCustomer).toHaveBeenCalled();
    expect(spyEventHandlerCustomer2).toHaveBeenCalled();
    expect(spyEventHandlerAddress).toHaveBeenCalled();
  });
});
