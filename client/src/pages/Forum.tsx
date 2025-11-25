import { useState, useEffect } from "react";
import {
  MessageSquare,
  User,
  Calendar,
  ThumbsUp,
  MessageCircle,
  Filter,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { ForumPost } from "../types";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { forumAPI } from "../services/api";

const Forum: React.FC = () => {
  const { user } = useAuth();
  const { canManageForum, canRead } = usePermissions();
  const navigate = useNavigate();

  // Redirect users without read permission (should not happen as all users can read)
  if (!canRead()) {
    navigate("/");
    return null;
  }

  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<Partial<ForumPost>>({});
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await forumAPI.get();
        setForumPosts(data);
      } catch (error) {
        console.error("Error fetching forum posts:", error);
        // For now, use mock data as fallback
        setForumPosts([
          {
            _id: "1",
            title: "Materi Pemrograman Web Minggu Ini",
            content:
              "Apakah ada yang punya catatan tambahan tentang hooks di React?",
            author: {
              _id: "1",
              email: "andi@example.com",
              name: "Andi Pratama",
              className: "A",
              role: "user",
              createdAt: new Date(),
            },
            className: "A",
            tags: ["pemrograman-web", "react", "hooks"],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            comments: [
              {
                _id: "1",
                content:
                  "Saya punya beberapa sumber tambahan, bisa dishare di grup",
                author: {
                  _id: "2",
                  email: "sari@example.com",
                  name: "Sari Dewi",
                  className: "A",
                  role: "user",
                  createdAt: new Date(),
                },
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              },
            ],
            upvotes: 5,
          },
          {
            _id: "2",
            title: "Kuis Algoritma Besok",
            content: "Apakah kuis besok mencakup materi sorting dan searching?",
            author: {
              _id: "3",
              email: "joko@example.com",
              name: "Joko Susanto",
              className: "B",
              role: "user",
              createdAt: new Date(),
            },
            className: "B",
            tags: ["algoritma", "kuis"],
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            comments: [],
            upvotes: 3,
          },
          {
            _id: "3",
            title: "Deadline Tugas Pemrograman",
            content: "Apakah deadline tugas pemrograman web diperpanjang?",
            author: {
              _id: "4",
              email: "rina@example.com",
              name: "Rina Kartika",
              className: "C",
              role: "class_rep",
              createdAt: new Date(),
            },
            className: "C",
            tags: ["tugas", "deadline"],
            createdAt: new Date(),
            comments: [
              {
                _id: "2",
                content: "Belum ada informasi resmi, cek terus grup kelas",
                author: {
                  _id: "5",
                  email: "budi@example.com",
                  name: "Budi Santoso",
                  className: "C",
                  role: "class_rep",
                  createdAt: new Date(),
                },
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
              },
            ],
            upvotes: 8,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");

  // Get all unique tags
  const allTags = Array.from(new Set(forumPosts.flatMap((post) => post.tags)));

  // Filter posts based on selected filters
  const filteredPosts = forumPosts.filter((post) => {
    const classMatch = filterClass === "all" || post.className === filterClass;
    const tagMatch = filterTag === "all" || post.tags.includes(filterTag);

    return classMatch && tagMatch;
  });

  // Handler functions for forum actions
  const handleAddPost = () => {
    setCurrentPost({
      title: "",
      content: "",
      className: user?.className || "A",
      tags: [],
    });
    setShowAddModal(true);
  };

  const handleEditPost = async (id: string) => {
    const post = forumPosts.find((p) => p._id === id);
    if (post) {
      setCurrentPost(post);
      setShowEditModal(true);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm(`Yakin ingin menghapus post dengan ID: ${id}?`)) {
      try {
        await forumAPI.delete(id);
        // Refresh the forum posts after deletion
        const updatedPosts = await forumAPI.get();
        setForumPosts(updatedPosts);
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Gagal menghapus post. Silakan coba lagi.");
      }
    }
  };

  // Handle form submission for adding new post
  const handleCreatePost = async () => {
    try {
      // Prepare the data to send
      const postData = {
        ...currentPost,
        author: user, // Use current logged in user
        upvotes: 0,
        comments: [],
      };

      await forumAPI.create(postData);
      // Refresh the forum posts data
      const updatedPosts = await forumAPI.get();
      setForumPosts(updatedPosts);
      setShowAddModal(false);
      setCurrentPost({});
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Gagal menambahkan post. Silakan coba lagi.");
    }
  };

  // Handle form submission for updating post
  const handleUpdatePost = async () => {
    if (!currentPost._id || !user) return;

    try {
      await forumAPI.update(currentPost._id, currentPost);
      // Refresh the forum posts data
      const updatedPosts = await forumAPI.get();
      setForumPosts(updatedPosts);
      setShowEditModal(false);
      setCurrentPost({});
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Gagal memperbarui post. Silakan coba lagi.");
    }
  };

  // Handle form input changes
  const handlePostInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentPost((prev) => ({
      ...prev,
      [name]:
        name === "tags" ? value.split(",").map((tag) => tag.trim()) : value,
    }));
  };

  // Handle tags input separately
  const handleTagsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setCurrentPost((prev) => ({
      ...prev,
      tags,
    }));
  };

  // Toggle comments for a specific post
  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Handle comment input change
  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Handle adding a comment
  const handleAddComment = async (postId: string) => {
    const commentContent = commentInputs[postId];
    if (!commentContent.trim()) return;

    try {
      if (!user) {
        alert("Silakan login untuk menambahkan komentar");
        return;
      }

      // Prepare comment data
      const commentData = {
        content: commentContent,
        author: {
          _id: user._id,
          name: user.name,
          email: user.email,
          className: user.className,
          role: user.role,
          createdAt: user.createdAt,
        },
      };

      // Send to the API
      await forumAPI.addComment(postId, commentData);

      // Refresh the forum posts
      const updatedPosts = await forumAPI.get();
      setForumPosts(updatedPosts);

      // Clear the input field
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Gagal menambahkan komentar. Silakan coba lagi.");
    }
  };

  // Handle liking a post
  const handleLikePost = async (postId: string) => {
    try {
      // Toggle like status by calling API
      await forumAPI.toggleLike(postId);

      // Refresh the forum posts
      const updatedPosts = await forumAPI.get();
      setForumPosts(updatedPosts);
    } catch (error) {
      console.error("Error updating like:", error);
      alert("Gagal memperbarui status like. Silakan coba lagi.");
    }
  };

  // Helper function to get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "class_rep":
        return "Ketua Kelas";
      case "admin":
        return "Administrator";
      default:
        return "Anggota";
    }
  };

  // Helper function to get safe author name
  const getSafeAuthorName = (author: any) => {
    return author?.name || "Unknown User";
  };

  // Helper function to get safe author initial
  const getSafeAuthorInitial = (author: any) => {
    return author?.name?.charAt(0)?.toUpperCase() || "?";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <MessageSquare className="mr-3 text-primary-600" size={32} />
            Forum Diskusi
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Tanya jawab antar anggota angkatan
          </p>
        </div>

        <button
          className="mt-4 md:mt-0 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center transition"
          onClick={handleAddPost}
        >
          <Plus className="mr-2" size={20} />
          Buat Postingan
        </button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md dark:shadow-dark-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <Filter
              className="text-gray-500 dark:text-gray-400 mr-2"
              size={20}
            />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="all">Semua Kelas</option>
              <option value="A">Kelas A</option>
              <option value="B">Kelas B</option>
              <option value="C">Kelas C</option>
            </select>
          </div>

          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
          >
            <option value="all">Semua Tag</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post._id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition dark:border-dark-700 dark:bg-dark-700"
              >
                {/* Header dengan info author yang lebih menonjol */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {/* Avatar/Inisial User */}
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center dark:bg-primary-900">
                      <span className="text-primary-800 font-bold text-sm dark:text-primary-200">
                        {getSafeAuthorInitial(post.author)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {getSafeAuthorName(post.author)}
                        </span>
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs dark:bg-primary-900 dark:text-primary-200">
                          {post.className}
                        </span>
                        {post.author?.role && post.author.role !== "user" && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs dark:bg-green-900 dark:text-green-200">
                            {getRoleDisplayName(post.author.role)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm dark:text-gray-400">
                        <Calendar className="mr-1" size={14} />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol aksi */}
                  {(user?._id === post.author?._id || canManageForum()) && (
                    <div className="flex space-x-2">
                      <button
                        className="text-green-600 hover:text-green-800 p-1 dark:text-green-400 dark:hover:text-green-300"
                        onClick={() => handleEditPost(post._id)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-1 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Konten postingan */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 dark:text-gray-200">
                  {post.title}
                </h3>

                <p className="text-gray-700 mb-4 dark:text-gray-300">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm dark:bg-dark-600 dark:text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Aksi: Like dan Comment */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-600">
                  <div className="flex space-x-4">
                    <button
                      className="flex items-center text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                      onClick={() => handleLikePost(post._id)}
                    >
                      <ThumbsUp className="mr-1" size={18} />
                      <span>{post.upvotes || 0}</span>
                    </button>
                    <button
                      className="flex items-center text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                      onClick={() => toggleComments(post._id)}
                    >
                      <MessageCircle className="mr-1" size={18} />
                      <span>{post.comments?.length || 0} komentar</span>
                    </button>
                  </div>

                  <button
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => toggleComments(post._id)}
                  >
                    {expandedComments[post._id] ? "Tutup" : "Balas"}
                  </button>
                </div>

                {/* Komentar Section */}
                {expandedComments[post._id] && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-dark-600">
                    <div className="flex items-center mb-4">
                      <input
                        type="text"
                        value={commentInputs[post._id] || ""}
                        onChange={(e) =>
                          handleCommentInputChange(post._id, e.target.value)
                        }
                        placeholder="Tulis komentar..."
                        className="flex-1 border border-gray-300 dark:border-dark-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-lg"
                      >
                        Kirim
                      </button>
                    </div>

                    {/* Daftar Komentar */}
                    <div className="space-y-3">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div
                            key={comment._id}
                            className="bg-gray-50 p-3 rounded-lg dark:bg-dark-600"
                          >
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2 dark:bg-primary-900">
                                <span className="text-primary-800 text-xs font-bold dark:text-primary-200">
                                  {getSafeAuthorInitial(comment.author)}
                                </span>
                              </div>
                              <span className="font-medium text-sm dark:text-gray-200">
                                {getSafeAuthorName(comment.author)}
                              </span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString(
                                  "id-ID"
                                )}
                              </span>
                              {comment.author?.role &&
                                comment.author.role !== "user" && (
                                  <span className="ml-2 bg-green-100 text-green-800 px-1 py-0.5 rounded text-xs dark:bg-green-900 dark:text-green-200">
                                    {getRoleDisplayName(comment.author.role)}
                                  </span>
                                )}
                            </div>
                            <p className="text-gray-700 text-sm dark:text-gray-300">
                              {comment.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm dark:text-gray-400">
                          Belum ada komentar
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Tidak ada postingan forum yang ditemukan
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center"
          onClick={handleAddPost}
        >
          <Plus className="mr-2" size={20} />
          Buat Postingan Baru
        </button>
      </div>

      {/* Add Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Tambah Postingan Baru
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Judul Postingan
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentPost.title || ""}
                  onChange={handlePostInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Judul postingan"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Konten
                </label>
                <textarea
                  name="content"
                  value={currentPost.content || ""}
                  onChange={handlePostInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Tulis konten postingan di sini..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Kelas
                  </label>
                  <select
                    name="className"
                    value={currentPost.className || user?.className}
                    onChange={handlePostInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  >
                    <option value="A">Kelas A</option>
                    <option value="B">Kelas B</option>
                    <option value="C">Kelas C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Tag (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    name="tagsInput"
                    value={currentPost.tags?.join(", ") || ""}
                    onChange={handleTagsInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                    placeholder="contoh: pemrograman-web, react, hooks"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                Batal
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Edit Postingan
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Judul Postingan
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentPost.title || ""}
                  onChange={handlePostInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Judul postingan"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Konten
                </label>
                <textarea
                  name="content"
                  value={currentPost.content || ""}
                  onChange={handlePostInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Tulis konten postingan di sini..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Kelas
                  </label>
                  <select
                    name="className"
                    value={currentPost.className || user?.className}
                    onChange={handlePostInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  >
                    <option value="A">Kelas A</option>
                    <option value="B">Kelas B</option>
                    <option value="C">Kelas C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Tag (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    name="tagsInput"
                    value={currentPost.tags?.join(", ") || ""}
                    onChange={handleTagsInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                    placeholder="contoh: pemrograman-web, react, hooks"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                Batal
              </button>
              <button
                onClick={handleUpdatePost}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
