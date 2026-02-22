export default function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold text-gray-800">{value}</h3>
    </div>
  );
}
