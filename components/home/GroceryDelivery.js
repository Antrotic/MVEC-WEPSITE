import GroceryDeliveryItem from './helper/GroceryDeliveryItem';

const GroceryDelivery = () => {
  const list = [
    {
      id: '01',
      title: 'Meats',
      description: 'Our meat is fresh daily.',
      video: '/assets/media/1.mp4',
    },
    {
      id: '02',
      title: 'Bakery',
      description: 'Our baked goods are fresh daily.',
      video: '/assets/media/2.mp4',
    },
    {
      id: '03',
      title: 'Vegetables',
      description: 'Our vegetables are fresh daily.',
      video: '/assets/media/3.mp4',
    },
  ];
  return (
    <div className="container section">
      <div className="grocery_delivery">
        <div className="title">Why shop at Sameh Mall</div>
        <div className="items">
          {list?.map((item, key) => {
            return <GroceryDeliveryItem key={key} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default GroceryDelivery;
