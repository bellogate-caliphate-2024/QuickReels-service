import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../../services/comments.service';
import { CommentRepository } from '../../repository/comments.repository';
import { CreateCommentDto } from '../../dtos/comments.dto';

describe('CommentService', () => {
  let commentService: CommentService;
  let commentRepository: CommentRepository;

  const mockCommentRepository = {
    createComment: jest.fn(),
    deleteComment: jest.fn(),
    getPaginatedComments: jest.fn(),
    getRepliesByCommentId: jest.fn(),
    getCommentCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a comment', async () => {
    const dto: CreateCommentDto = {
      contentId: '123',
      text: 'This is a test comment',
      userId: 'user2',
      parentId: '',
    };

    const mockComment = { ...dto, _id: 'comment1' };
    mockCommentRepository.createComment.mockResolvedValue(mockComment);

    const result = await commentService.addComment(dto);

    expect(result).toEqual(mockComment);
    expect(mockCommentRepository.createComment).toHaveBeenCalledWith(dto);
  });

  it('should delete a comment', async () => {
    const commentId = 'comment1';
    mockCommentRepository.deleteComment.mockResolvedValue({
      success: true,
      message: 'Comment deleted successfully',
    });

    const result = await commentService.deleteComment(commentId);

    expect(result).toEqual({
      success: true,
      message: 'Comment deleted successfully',
    });
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(commentId);
  });

  it('should fetch paginated comments for a post', async () => {
    const contentId = 'post1';
    const comments = [
      { _id: 'comment1', text: 'Test 1', contentId },
      { _id: 'comment2', text: 'Test 2', contentId },
    ];
    mockCommentRepository.getPaginatedComments.mockResolvedValue(comments);
    mockCommentRepository.getCommentCount.mockResolvedValue(comments.length);
    mockCommentRepository.getPaginatedComments.mockResolvedValue(comments);

    const result = await commentService.getComments(contentId, 1, 10);

    expect(result.comments).toEqual(comments);
    expect(mockCommentRepository.getPaginatedComments).toHaveBeenCalledWith(
      contentId,
      0,
      10,
    );
  });

  it('should add a reply to a comment and associate it correctly', async () => {
    const dto: CreateCommentDto = {
      contentId: 'post1',
      text: 'This is a reply',
      userId: 'user2',
      parentId: 'comment1',
    };

    const mockReply = { ...dto, _id: 'reply1' };
    mockCommentRepository.createComment.mockResolvedValue(mockReply);

    const result = await commentService.addComment(dto);

    expect(result).toEqual(mockReply);
    expect(mockCommentRepository.createComment).toHaveBeenCalledWith(dto);
  });

  it('should delete a reply', async () => {
    const replyId = 'reply1';
    mockCommentRepository.deleteComment.mockResolvedValue({
      success: true,
      message: 'Comment deleted successfully',
    });

    const result = await commentService.deleteComment(replyId);

    expect(result).toEqual({
      success: true,
      message: 'Comment deleted successfully',
    });
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(replyId);
  });

 
});
