import { getCategories } from '@/lib/data';
import CategoryCard from '@/components/ui/CategoryCard';

export default function CategoryGridSection() {
  const categories = getCategories();

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
