import { FC, useEffect, useRef } from 'react'
import ProductCard from '../../components/Product-card/Product-card'
import LoadingPreview from '../../components/Product-card/Loading-preview'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Sortitem } from '../../types'
import Select from '../../components/Select/Select'
import qs from 'qs'
import { setSortBy } from '../../store/slices/filtersSlice'
import { categorySelector } from '../../store/slices/categoriesSlice'
import { fetchProducts, productSelector } from '../../store/slices/productSlice'
import { ProductItem } from '../../types/products'

const CategoryPage: FC = () => {
    const { items, loading } = useAppSelector(productSelector)
    const { category } = useAppSelector(categorySelector)
    const sortBy = useAppSelector((state) => state.filters.sortBy)

    const { link } = useParams()

    const categoryLink: string = category ? category : link

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { search } = useLocation()

    const sortByDidSet = useRef(false)

    useEffect(() => {
        const params = qs.parse(search.substring(1))

        if (sortBy.type !== params.type || sortBy.order !== params.order) {
            const urlSortBy = sortItems.find((obj) => {
                return obj.type === params.type && obj.order === params.order
            })
            if (urlSortBy) {
                dispatch(setSortBy(urlSortBy))
            }
        }

        sortByDidSet.current = true
    }, [])

    useEffect(() => {
        if (sortByDidSet) {
            dispatch(fetchProducts({ category: categoryLink, type: sortBy.type, order: sortBy.order }))
        }
    }, [sortBy])

    useEffect(() => {
        window.scrollTo({ top: 0 })

        const queryString = qs.stringify({
            type: sortBy.type,
            order: sortBy.order,
        })

        navigate(`?${queryString}`)
    }, [sortBy])

    const sortItems: Sortitem[] = [
        { name: 'популярности', type: 'rating', order: 'desc' },
        { name: 'наличию', type: 'available', order: 'desc' },
        { name: 'цене (от дешевых)', type: 'actualPrice', order: 'asc' },
        { name: 'цене (от дорогих)', type: 'actualPrice', order: 'desc' },
        { name: 'алфавиту', type: 'name', order: 'asc' },
    ]

    return (
        <div className="container">
            <div className="category-page">
                <div className="category-page__header">
                    <Select sortItems={sortItems} activeSortType={sortBy} />
                </div>

                <div className="category-page__body">
                    {loading === 'success'
                        ? items.map((obj: ProductItem) => <ProductCard key={obj.id} {...obj} />)
                        : [...new Array(8)].map((_, index) => <LoadingPreview key={index} />)}
                </div>
            </div>
        </div>
    )
}

export default CategoryPage
