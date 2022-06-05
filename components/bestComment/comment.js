const Bestcomments = (props) => {
  return (
    <>
      <span>{props.com[0]?.authorName}</span>
      <span>👍 {props.com[0]?.like}</span>
      <div>{props.com[0]?.article}</div>
    </>
  );
};

export default Bestcomments;
