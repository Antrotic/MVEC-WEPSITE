const GroceryDeliveryItem = ({ item }) => {
  return (
    <div className="item">
      <div className={"context"}>
        <div className="number">{item.id}</div>
        <div className="name">{item.title}</div>
        <div className="description">{item.description}</div>
      </div>
      <video loop muted autoPlay>
        <source src={item.video} />
      </video>
    </div>
  );
};

export default GroceryDeliveryItem;
