const CustomDots = ({
  onClick,
  active,
  width = '30px',
  fsize = '20px',
  fw = '400',
  bg="unset",
  bR="0px"
}: any) => {
  return (
    <>
      <button
        style={{
          width,
          height: '30px',
          color: active ? '#fff' : '#333',
          fontSize: fsize,
          margin: '0 5px',
          fontWeight: fw,
          background: bg,
          borderRadius: bR
        }}
        onClick={onClick}
      >
        {active ? active : ''}
      </button>
    </>
  );
};

export default CustomDots;
