import React from 'react';
import CategoryItem from '../components/CategoryItem';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useCategories } from '../hooks/useCategories';
import { useToast } from '../hooks/useToast';

function TagsPage() {
  const { categories, loading, fetchCategories, isReady } = useCategories();
  const { showError } = useToast();

  React.useEffect(() => {
    if (isReady) {
      fetchCategories().catch(() => showError({summary: 'Błąd ładowania', details: 'Spróbuj odświeżyć stronę!'}));
    }
  }, [isReady]);

  return (
    <div className="min-h-screen items-center justify-center bg-gray-100">
      <div className="max-w-lg mx-auto text-xl">
        <h1 className="pt-8">Kategorie</h1>
        <p></p>
        {loading ? (
          <ProgressSpinner />
        ) : (
          <div>
            {categories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
              <CategoryItem key={'NEW'} isNew={true} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TagsPage;
