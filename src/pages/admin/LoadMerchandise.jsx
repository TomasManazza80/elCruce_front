import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCreateProductMutation, useGetProductsQuery, useDeleteProductMutation, useUploadImageMutation, useUpdateProductMutation } from '../../services/api/productApi.js';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../../services/api/categoryApi.js';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { toast } from '../../components/ui/use-toast.tsx';
import { Loader2, Trash2, Plus, Pencil, Search, X, ChevronDown } from 'lucide-react';

export default function LoadMerchandise() {
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const { data: products, isLoading: isLoadingProducts } = useGetProductsQuery();
    const { data: categories } = useGetCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
    const [isEditCatDropdownOpen, setIsEditCatDropdownOpen] = useState(false);
    const catDropdownRef = React.useRef(null);
    const editCatDropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (catDropdownRef.current && !catDropdownRef.current.contains(event.target)) {
                setIsCatDropdownOpen(false);
            }
            if (editCatDropdownRef.current && !editCatDropdownRef.current.contains(event.target)) {
                setIsEditCatDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDeleteCategory = async (e, id, name) => {
        e.stopPropagation();
        if(window.confirm(`¿Seguro que deseas eliminar la categoría "${name}"?`)) {
            try {
                await deleteCategory(id).unwrap();
                toast({ title: 'Éxito', description: 'Categoría eliminada', variant: 'success' });
                if (formData.category === name) setFormData(prev => ({ ...prev, category: '' }));
                if (editFormData.category === name) setEditFormData(prev => ({ ...prev, category: '' }));
            } catch (err) {
                toast({ title: 'Error', description: 'No se pudo eliminar la categoría', variant: 'destructive' });
            }
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    // State for CREATING
    const [formData, setFormData] = useState({ name: '', pricePerKilo: '', description: '', category: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // State for EDITING
    const [editingProductId, setEditingProductId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', pricePerKilo: '', description: '', category: '' });
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImageFile(file);
            setEditImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEdit = (product) => {
        setEditingProductId(product.id);
        setEditFormData({
            name: product.name,
            pricePerKilo: product.pricePerKilo,
            description: product.description || '',
            category: product.category || '',
        });
        setEditImageFile(null);
        setEditImagePreview(product.imageUrl || null);
    };

    const handleCancelEdit = () => {
        setEditingProductId(null);
        setEditFormData({ name: '', pricePerKilo: '', description: '', category: '' });
        setEditImageFile(null);
        setEditImagePreview(null);
    };

    const filteredProducts = products?.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = null;
            if (imageFile) {
                const formDataImage = new FormData();
                formDataImage.append('image', imageFile);
                const uploadResult = await uploadImage(formDataImage).unwrap();
                if (uploadResult.success) {
                    imageUrl = uploadResult.url;
                }
            }

            await createProduct({
                ...formData,
                pricePerKilo: parseFloat(formData.pricePerKilo),
                imageUrl
            }).unwrap();

            toast({ title: 'Éxito', description: 'Producto creado correctamente', variant: 'success' });
            setFormData({ name: '', pricePerKilo: '', description: '', category: '' });
            setImageFile(null);
            setImagePreview(null);
            const fileInput = document.getElementById('image');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Hubo un problema al crear el producto', variant: 'destructive' });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = null;
            if (editImageFile) {
                const formDataImage = new FormData();
                formDataImage.append('image', editImageFile);
                const uploadResult = await uploadImage(formDataImage).unwrap();
                if (uploadResult.success) {
                    imageUrl = uploadResult.url;
                }
            } else if (editImagePreview) {
                imageUrl = editImagePreview; 
            }

            await updateProduct({
                id: editingProductId,
                ...editFormData,
                pricePerKilo: parseFloat(editFormData.pricePerKilo),
                imageUrl
            }).unwrap();

            toast({ title: 'Éxito', description: 'Producto actualizado correctamente', variant: 'success' });
            handleCancelEdit();
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Hubo un problema al guardar el producto', variant: 'destructive' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
            try {
                await deleteProduct(id).unwrap();
                toast({ title: 'Eliminado', description: 'Producto eliminado', variant: 'success' });
            } catch (err) {
                toast({ title: 'Error', description: 'No se pudo eliminar el producto', variant: 'destructive' });
            }
        }
    };

    const handleAddCategory = async () => {
        const newCat = window.prompt("Ingrese el nombre de la nueva categoría:");
        if (newCat && newCat.trim() !== '') {
            try {
                await createCategory(newCat.trim().toUpperCase()).unwrap();
                toast({ title: 'Éxito', description: 'Categoría añadida', variant: 'success' });
            } catch (err) {
                toast({ title: 'Error', description: 'No se pudo crear la categoría', variant: 'destructive' });
            }
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 relative">
            <h1 className="text-3xl font-bold tracking-tight">Carga de Mercadería</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formulario de CREAR */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Añadir Nuevo Corte</h2>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Producto *</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="pricePerKilo">Precio por Kilo *</Label>
                            <Input id="pricePerKilo" name="pricePerKilo" type="number" step="0.01" value={formData.pricePerKilo} onChange={handleInputChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <div className="flex gap-2">
                                <div className="relative w-full" ref={catDropdownRef}>
                                    <div 
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                                        onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                                    >
                                        <span className={formData.category ? "" : "text-muted-foreground"}>
                                            {formData.category || "Seleccione una categoría"}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </div>
                                    
                                    {isCatDropdownOpen && (
                                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md bg-white">
                                            <div 
                                                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-3 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground hover:bg-gray-100"
                                                onClick={() => { setFormData(prev => ({ ...prev, category: '' })); setIsCatDropdownOpen(false); }}
                                            >
                                                Seleccione una categoría
                                            </div>
                                            {categories?.map(cat => (
                                                <div 
                                                    key={cat.id} 
                                                    className="relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm py-1.5 pl-3 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground hover:bg-gray-100 group"
                                                    onClick={() => { setFormData(prev => ({ ...prev, category: cat.name })); setIsCatDropdownOpen(false); }}
                                                >
                                                    <span>{cat.name}</span>
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => handleDeleteCategory(e, cat.id, cat.name)}
                                                        className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity p-1"
                                                        title="Eliminar categoría"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Button type="button" onClick={handleAddCategory} variant="outline" size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción / Datos Relevantes</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Foto del Producto</Label>
                            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                            {imagePreview && (
                                <div className="mt-2 relative inline-block">
                                    <img src={imagePreview} alt="Preview" className="h-32 object-cover rounded-md" />
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setImageFile(null);
                                            const fileInput = document.getElementById('image');
                                            if (fileInput) fileInput.value = '';
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button type="submit" className="w-full" disabled={isCreating || isUploading}>
                                {isCreating || isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Guardar Producto
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Lista de Cortes Cargados */}
                <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">Cortes Cargados</h2>
                    <div className="relative mb-4">
                        <Input 
                            type="text" 
                            placeholder="Buscar corte..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="pl-9"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    {isLoadingProducts ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-gray-400"/></div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {filteredProducts?.map(product => (
                                <div 
                                    key={product.id} 
                                    className={`flex items-center gap-4 p-3 border rounded-lg transition-colors hover:bg-gray-50`}
                                >
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">Sin foto</div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm truncate">{product.name}</h3>
                                        <p className="text-sm text-gray-500">${product.pricePerKilo} / kg</p>
                                        <p className="text-xs text-gray-400 truncate">{product.category}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                            <Pencil className="h-4 w-4 text-blue-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts?.length === 0 && (
                                <p className="text-center text-gray-500 text-sm py-4">No se encontraron productos.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Edición Flotante (Renderizado en el root para ocupar toda la pantalla) */}
            {editingProductId && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header del Modal */}
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-blue-50">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-blue-900">
                                <Pencil className="w-5 h-5 text-blue-600" />
                                Editar Corte: {editFormData.name}
                            </h2>
                            <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-700 transition">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body del Modal */}
                        <div className="p-6 overflow-y-auto">
                            <form id="editForm" onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Nombre del Producto *</Label>
                                    <Input id="edit-name" name="name" value={editFormData.name} onChange={handleEditInputChange} required />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="edit-pricePerKilo">Precio por Kilo *</Label>
                                    <Input id="edit-pricePerKilo" name="pricePerKilo" type="number" step="0.01" value={editFormData.pricePerKilo} onChange={handleEditInputChange} required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-category">Categoría</Label>
                                    <div className="flex gap-2">
                                        <div className="relative w-full" ref={editCatDropdownRef}>
                                            <div 
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                                                onClick={() => setIsEditCatDropdownOpen(!isEditCatDropdownOpen)}
                                            >
                                                <span className={editFormData.category ? "" : "text-muted-foreground"}>
                                                    {editFormData.category || "Seleccione una categoría"}
                                                </span>
                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                            </div>
                                            
                                            {isEditCatDropdownOpen && (
                                                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md bg-white">
                                                    <div 
                                                        className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-3 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground hover:bg-gray-100"
                                                        onClick={() => { setEditFormData(prev => ({ ...prev, category: '' })); setIsEditCatDropdownOpen(false); }}
                                                    >
                                                        Seleccione una categoría
                                                    </div>
                                                    {categories?.map(cat => (
                                                        <div 
                                                            key={cat.id} 
                                                            className="relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm py-1.5 pl-3 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground hover:bg-gray-100 group"
                                                            onClick={() => { setEditFormData(prev => ({ ...prev, category: cat.name })); setIsEditCatDropdownOpen(false); }}
                                                        >
                                                            <span>{cat.name}</span>
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => handleDeleteCategory(e, cat.id, cat.name)}
                                                                className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity p-1"
                                                                title="Eliminar categoría"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-description">Descripción / Datos Relevantes</Label>
                                    <Textarea id="edit-description" name="description" value={editFormData.description} onChange={handleEditInputChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-image">Foto del Producto</Label>
                                    <Input id="edit-image" type="file" accept="image/*" onChange={handleEditImageChange} />
                                    {editImagePreview && (
                                        <div className="mt-2 relative inline-block">
                                            <img src={editImagePreview} alt="Preview" className="h-32 object-cover rounded-md" />
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setEditImagePreview(null);
                                                    setEditImageFile(null);
                                                    const fileInput = document.getElementById('edit-image');
                                                    if (fileInput) fileInput.value = '';
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Footer del Modal */}
                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isUpdating || isUploading}>
                                Cancelar
                            </Button>
                            <Button type="submit" form="editForm" className="bg-blue-600 hover:bg-blue-700" disabled={isUpdating || isUploading}>
                                {isUpdating || isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Guardar Cambios
                            </Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
