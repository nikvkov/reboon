<?php
/**
 * Review Comments Template
 *
 * Closing li is left out on purpose!.
 *
 * @version     2.6.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$porto_woo_version = porto_get_woo_version_number();

if (version_compare($porto_woo_version, '2.6', '>=')) :
?>
<li itemprop="review" itemscope itemtype="http://schema.org/Review" <?php comment_class(); ?> id="li-comment-<?php comment_ID() ?>">

    <div id="comment-<?php comment_ID(); ?>" class="comment_container">

        <?php
        /**
         * The woocommerce_review_before hook
         *
         * @hooked woocommerce_review_display_gravatar - 10
         */
        do_action( 'woocommerce_review_before', $comment );
        ?>

        <div class="comment-text">

            <?php
            /**
             * The woocommerce_review_before_comment_meta hook.
             *
             * @hooked woocommerce_review_display_rating - 10
             */
            do_action( 'woocommerce_review_before_comment_meta', $comment );

            /**
             * The woocommerce_review_meta hook.
             *
             * @hooked woocommerce_review_display_meta - 10
             */
            do_action( 'woocommerce_review_meta', $comment );

            do_action( 'woocommerce_review_before_comment_text', $comment );

            /**
             * The woocommerce_review_comment_text hook
             *
             * @hooked woocommerce_review_display_comment_text - 10
             */
            do_action( 'woocommerce_review_comment_text', $comment );

            do_action( 'woocommerce_review_after_comment_text', $comment ); ?>

        </div>
    </div>
<?php else :

$rating = intval( get_comment_meta( $comment->comment_ID, 'rating', true ) );

if (version_compare($porto_woo_version, '2.5', '>=')) {
    $verified = wc_review_is_from_verified_owner( $comment->comment_ID );
}

?>
<li itemprop="review" itemscope itemtype="http://schema.org/Review" <?php comment_class(); ?> id="li-comment-<?php comment_ID() ?>">

	<div id="comment-<?php comment_ID(); ?>" class="comment_container">

		<div class="img-thumbnail"><?php echo get_avatar( $comment, apply_filters( 'woocommerce_review_gravatar_size', '60' ), '' ); ?></div>

		<div class="comment-text">

			<?php if ( $rating && get_option( 'woocommerce_enable_review_rating' ) === 'yes' ) : ?>

				<div itemprop="reviewRating" itemscope itemtype="http://schema.org/Rating" class="star-rating" title="<?php echo $rating ?>">
					<span style="width:<?php echo ( $rating / 5 ) * 100; ?>%"><strong itemprop="ratingValue"><?php echo $rating; ?></strong> <?php _e( 'out of 5', 'woocommerce' ); ?></span>
				</div>

			<?php endif; ?>

            <?php do_action( 'woocommerce_review_before_comment_meta', $comment ); ?>

            <?php if ( $comment->comment_approved == '0' ) : ?>

				<p class="meta"><em><?php _e( 'Your comment is awaiting approval', 'woocommerce' ); ?></em></p>

			<?php else : ?>

				<p class="meta">
					<strong itemprop="author"><?php comment_author(); ?></strong> <?php

						if ( get_option( 'woocommerce_review_rating_verification_label' ) === 'yes' )
							if ( version_compare($porto_woo_version, '2.5', '>=') ? $verified : wc_customer_bought_product( $comment->comment_author_email, $comment->user_id, $comment->comment_post_ID ) )
								echo '<em class="verified">(' . __( 'verified owner', 'woocommerce' ) . ')</em> ';

					?>&ndash; <time itemprop="datePublished" datetime="<?php echo get_comment_date( 'c' ); ?>"><?php echo get_comment_date( wc_date_format() ); ?></time>
				</p>

			<?php endif; ?>

            <?php do_action( 'woocommerce_review_before_comment_text', $comment ); ?>

			<div itemprop="description" class="description"><?php comment_text(); ?></div>

            <?php do_action( 'woocommerce_review_after_comment_text', $comment ); ?>

		</div>
	</div>
<?php endif; ?>