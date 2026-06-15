import { getTags } from '@/lib/action/tag.action'

const Tag = async () => {
    const { success, data, error } = await getTags({
        page: 1,
        pageSize: 10,
        query: '',
        filter: 'popular'
    })
    const tags = data || {}
    console.log("tags", JSON.stringify(tags, null, 2))
    return (
        <div>Tag</div>
    )
}

export default Tag