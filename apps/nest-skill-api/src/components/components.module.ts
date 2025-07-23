import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { OrderModule } from './order/order.module';
import { NoticeModule } from './notice/notice.module';
import { PaymentModule } from './payment/payment.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';
import { ViewModule } from './view/view.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { ReviewModule } from './review/review.module';
import { ProviderPostModule } from './provider-post/provider-post.module';

@Module({
	imports: [
		MemberModule,
		AuthModule,
		NotificationModule,
		OrderModule,
		NoticeModule,
		PaymentModule,
		CommentModule,
		LikeModule,
		FollowModule,
		ViewModule,
		BoardArticleModule,
		ReviewModule,
		ProviderPostModule,
	],
})
export class ComponentsModule {}
