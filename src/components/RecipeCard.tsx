type RecipeProps = {
  title: string;
  description: string;
};

export const RecipeCard = ({ title, description }: RecipeProps) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      <h1>probando</h1>
    </div>
  );
};
