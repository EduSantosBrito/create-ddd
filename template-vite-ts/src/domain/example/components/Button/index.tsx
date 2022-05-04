type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: ButtonProps) => {
    return <button {...props} />;
};

export default Button;
