// import "./error-fallback.styles.scss";

const ErrorFallback = ({ error }: any) => {
  return (
    <div>
      <p>Something went wrong</p>
      <pre>{error.message}</pre>
    </div>
  );
};

export default ErrorFallback;
